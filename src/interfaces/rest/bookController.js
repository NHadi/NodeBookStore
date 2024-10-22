// src/interfaces/rest/bookController.js
const express = require('express');
const AddBookCommand = require('../../application/commands/addBookCommand');

class BookController {
    constructor(bookService) {
        this.bookService = bookService;
    }

    routes() {
        const router = express.Router();

        // Route to add a new book
        router.post('/books', async (req, res) => {
            try {
                console.log('Request received:', req.body); // Log request data

                const { title, author } = req.body;
                
                // Check if the required fields are present
                if (!title || !author) {
                    return res.status(400).json({ message: 'Title and author are required' });
                }

                // Create the command
                const command = new AddBookCommand(title, author);

                // Call the book service to add the book
                console.log('Adding book...');
                const book = await this.bookService.addBook(command);
                console.log('Book added:', book);

                // Send response back to the client with status 201 (Created)
                res.status(201).json(book);

            } catch (error) {
                // Log the error for debugging purposes
                console.error('Error while adding book:', error);

                // Send an appropriate error response to the client
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });


        // Route to filter books by title
        router.get('/books/search', async (req, res) => {
            const { title } = req.query; // Get title from query parameter
            const books = await this.bookService.searchBooks(title);
            res.json(books);
        });

        return router;
    }
}

module.exports = BookController;
