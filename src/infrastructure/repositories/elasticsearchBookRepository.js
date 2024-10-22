//elasticsearchBookRepository.js
const { Client } = require('@elastic/elasticsearch');

class ElasticsearchBookRepository {
    constructor() {
        // Initialize Elasticsearch client
        this.client = new Client({
            node: 'http://elasticsearch:9200' // Assuming elasticsearch is the service name in Docker
        });
    }

    // Index a book in Elasticsearch
    async indexBook(book) {
        try {
            const response = await this.client.index({
                index: 'books',
                body: book
            });
            console.log('Book indexed in Elasticsearch:', response);
        } catch (error) {
            console.error('Error indexing book in Elasticsearch:', error);
            throw error;
        }
    }

  // Search books by title
    async searchBooks(title) {
        try {
            const result = await this.client.search({
                index: 'books',
                body: {
                    query: {
                        match: {
                            title: title
                        }
                    }
                }
            });

            // Log the full Elasticsearch response to inspect it
            console.log('Elasticsearch response:', JSON.stringify(result, null, 2));

            // Ensure result.hits and result.hits.hits are defined
            if (result.body && result.body.hits && result.body.hits.hits) {
                const books = result.body.hits.hits.map(hit => hit._source);
                return books;
            } else {
                console.error('No hits found in the Elasticsearch response:', result);
                return []; // Return an empty array if no hits are found
            }
        } catch (error) {
            console.error('Error searching books in Elasticsearch:', error);
            throw error;
        }
    }


}

module.exports = ElasticsearchBookRepository;
