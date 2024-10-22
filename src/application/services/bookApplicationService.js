// application/bookApplicationService.js
const { v4: uuidv4 } = require('uuid');

class BookApplicationService {
    constructor(cassandraRepo, elasticRepo, bookPublisher) {
        this.cassandraRepo = cassandraRepo;
        this.elasticRepo = elasticRepo;
        this.bookPublisher = bookPublisher; // Inject bookPublisher
    }

    // Add a new book and publish the event
    async addBook(command) {
        const book = {
            id: uuidv4(),
            title: command.title,
            author: command.author,
            createdAt: new Date().toISOString(),
        };

        try {
            console.log('Saving book to Cassandra...');
            await this.cassandraRepo.add(book);
            console.log('Book saved to Cassandra.');

            console.log('Publishing book created event to RabbitMQ...');
            await this.bookPublisher.publishBookCreatedEvent(book);

            return book;
        } catch (error) {
            console.error('Error in addBook:', error);
            throw error;
        }
    }

    // Search books by title in Elasticsearch
    async searchBooks(title) {
        try {
            console.log(`Searching for books with title: ${title}`);
            const books = await this.elasticRepo.searchBooks(title); // Search books using elasticRepo
            console.log('Books found:', books);
            return books;
        } catch (error) {
            console.error('Error searching books in Elasticsearch:', error);
            throw error;
        }
    }

    // Handle the BookCreated event (indexing into Elasticsearch)
    async handleBookCreatedEvent(event) {
        try {
            await this.elasticRepo.indexBook(event.book);
            console.log('Book indexed in Elasticsearch:', event.book);
        } catch (err) {
            console.error('Error indexing book in Elasticsearch:', err);
        }
    }
}

module.exports = BookApplicationService;
