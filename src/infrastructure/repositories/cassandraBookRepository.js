const cassandra = require('cassandra-driver');

class CassandraBookRepository {
    constructor() {
        // Initialize the client without the keyspace initially
        this.client = new cassandra.Client({
            contactPoints: [process.env.CASSANDRA_CONTACT_POINTS || 'cassandra'],
            localDataCenter: process.env.CASSANDRA_LOCAL_DATACENTER || 'datacenter1'
        });

        // Create the keyspace and table if they don't exist
        this.initialize();
    }

    // Function to create keyspace and table if they don't exist
    async initialize() {
        try {
            // Step 1: Create the keyspace if it doesn't exist
            await this.createKeyspace();
            
            // Step 2: Reinitialize the client with the keyspace after it's created
            this.client = new cassandra.Client({
                contactPoints: [process.env.CASSANDRA_CONTACT_POINTS || 'cassandra'],
                localDataCenter: process.env.CASSANDRA_LOCAL_DATACENTER || 'datacenter1',
                keyspace: 'bookstore'  // Now we specify the keyspace
            });

            // Step 3: Create the table if it doesn't exist
            await this.createTable();

        } catch (err) {
            console.error('Error during Cassandra initialization:', err);
        }
    }

    // Function to create the keyspace
    async createKeyspace() {
        const query = `
            CREATE KEYSPACE IF NOT EXISTS bookstore
            WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
        `;

        try {
            await this.client.execute(query);
            console.log("Keyspace 'bookstore' created or already exists.");
        } catch (err) {
            console.error("Error creating keyspace 'bookstore':", err);
        }
    }

    // Function to create the table if it doesn't exist
    async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS books (
                id UUID PRIMARY KEY,
                title TEXT,
                author TEXT,
                createdAt TIMESTAMP
            );
        `;

        try {
            await this.client.execute(query);
            console.log("Table 'books' created or already exists.");
        } catch (err) {
            console.error("Error creating table 'books':", err);
        }
    }

    // Method for adding a book
    add(book) {
        const query = 'INSERT INTO books (id, title, author, createdAt) VALUES (?, ?, ?, ?)';
        const params = [book.id, book.title, book.author, book.createdAt];
        return this.client.execute(query, params, { prepare: true });
    }
}

module.exports = CassandraBookRepository;
