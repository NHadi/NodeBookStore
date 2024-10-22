// src/application/queries/getBooksQuery.js

class GetBooksQuery {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }

    async execute() {
        try {
            // Fetch all books from the repository
            const books = await this.bookRepository.findAll();
            return books;
        } catch (error) {
            throw new Error('Failed to retrieve books: ' + error.message);
        }
    }
}

module.exports = GetBooksQuery;
