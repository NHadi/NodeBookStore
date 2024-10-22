
# NodeBookStore

**NodeBookStore** is a microservices-based application demonstrating how to manage a bookstore using various modern technologies such as **Node.js**, **Cassandra**, **Elasticsearch**, **RabbitMQ**, and **Docker**. The application supports event-driven architecture, allowing you to add, search, and manage books in a distributed, scalable way.

## Key Features

- **Microservices Architecture**: Services are split by their responsibilities.
- **Event-Driven Architecture**: Leveraging RabbitMQ for asynchronous communication.
- **Cassandra Database**: NoSQL database for persistent storage of book data.
- **Elasticsearch**: Used for fast, full-text search capabilities.
- **RabbitMQ**: Message broker for sending and receiving messages across services.
- **Docker**: Containerized application components for easy orchestration.

## Prerequisites

Before starting, ensure you have installed:

- [Docker](https://www.docker.com/products/docker-desktop)
- [Node.js](https://nodejs.org/)
- [RabbitMQ](https://www.rabbitmq.com/)
- [Cassandra](https://cassandra.apache.org/)
- [Elasticsearch](https://www.elastic.co/what-is/elasticsearch)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/NHadi/NodeBookStore.git
   cd NodeBookStore
   ```

2. **Set up Docker containers**

   Start all the services by running:

   ```bash
   docker-compose up -d
   ```

   This will start the following containers:
   - **Node.js API** for managing books.
   - **Cassandra** as the database.
   - **Elasticsearch** for searching books.
   - **RabbitMQ** as the message broker.

3. **Install Node.js dependencies**

   Install the required Node.js dependencies by running:

   ```bash
   npm install
   ```

4. **Environment Variables**

   Ensure the following environment variables are set correctly:

   ```bash
   RABBITMQ_QUEUE=book_queue
   RABBITMQ_URL=amqp://rabbitmq
   CASSANDRA_HOST=cassandra
   CASSANDRA_KEYSPACE=bookstore
   ELASTICSEARCH_HOST=http://elasticsearch:9200
   PORT=8082
   ```

5. **Run the Application**

   After the dependencies are installed, run the Node.js application:

   ```bash
   npm start
   ```

   The application will be running on `http://localhost:8082`.

## API Endpoints

### 1. Add a Book

- **URL**: `/books`
- **Method**: `POST`
- **Body**: 

   ```json
   {
      "title": "Book Title",
      "author": "Author Name"
   }
   ```

- **Response**:

   ```json
   {
      "id": "book-uuid",
      "title": "Book Title",
      "author": "Author Name",
      "createdAt": "2024-10-22T16:33:23.190Z"
   }
   ```

### 2. Search Books

- **URL**: `/books/search`
- **Method**: `GET`
- **Query Param**: `title`
- **Response**:

   ```json
   [
      {
         "id": "book-uuid",
         "title": "Book Title",
         "author": "Author Name",
         "createdAt": "2024-10-22T16:33:23.190Z"
      }
   ]
   ```

## Architecture

This project follows an event-driven architecture where books added to the system are processed and published as events using **RabbitMQ**. **Cassandra** is used for data storage, and **Elasticsearch** is used for searching books.

### Folder Structure

```bash
├── src
│   ├── application
│   │   └── services
│   │       └── bookApplicationService.js  # Main application service
│   ├── infrastructure
│   │   ├── repositories
│   │   │   ├── cassandraBookRepository.js  # Cassandra repository
│   │   │   └── elasticsearchBookRepository.js  # Elasticsearch repository
│   │   └── consumers
│   │       └── bookConsumer.js  # RabbitMQ consumer logic
│   └── interfaces
│       └── rest
│           └── bookController.js  # Express API routes
├── docker-compose.yml  # Docker configuration
└── README.md  # Documentation
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

For any questions, feel free to contact me at [https://github.com/NHadi](https://github.com/NHadi).
