// server.js
const express = require('express');
const bodyParser = require('body-parser');
const CassandraBookRepository = require('./src/infrastructure/repositories/cassandraBookRepository');
const ElasticsearchBookRepository = require('./src/infrastructure/repositories/elasticsearchBookRepository');
const BookApplicationService = require('./src/application/services/bookApplicationService');
const BookController = require('./src/interfaces/rest/bookController');
const BookPublisher = require('./src/infrastructure/eventHandlers/bookPublisher');
const BookConsumer = require('./src/infrastructure/eventHandlers/bookConsumer');

const app = express();
app.use(bodyParser.json());

(async () => {
    const cassandraRepo = new CassandraBookRepository();
    const elasticRepo = new ElasticsearchBookRepository();
    const bookPublisher = new BookPublisher();

    await bookPublisher.connectRabbitMQ(); // Connect the publisher to RabbitMQ

    const bookService = new BookApplicationService(cassandraRepo, elasticRepo, bookPublisher);
    
    // Initialize and start consumer
    const bookConsumer = new BookConsumer(bookService);
    await bookConsumer.connectRabbitMQ();
    bookConsumer.startRabbitMQConsumer();

    // Initialize controllers
    const bookController = new BookController(bookService);

    // Routes
    app.use(bookController.routes());

    const PORT = process.env.PORT || 8082;
    app.listen(PORT, () => {
        console.log(`BookService running on port ${PORT}`);
    });
})();
