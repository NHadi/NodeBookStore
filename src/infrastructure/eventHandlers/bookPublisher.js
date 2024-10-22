const amqp = require('amqplib');

class BookPublisher {
    constructor(queueName = 'book_queue') {
        this.queueName = queueName;
        this.channel = null;
    }

    async connectRabbitMQ() {
        try {
            console.log("Connecting to RabbitMQ for publishing...");
            const connection = await amqp.connect('amqp://rabbitmq');
            this.channel = await connection.createChannel();
            console.log("RabbitMQ connected for publishing");
        } catch (error) {
            console.error('Failed to connect to RabbitMQ for publishing:', error);
            throw new Error('RabbitMQ connection failed');
        }
    }

    async publishBookCreatedEvent(book) {
        if (!this.channel) {
            throw new Error('RabbitMQ channel is not initialized for publishing');
        }

        const event = {
            eventType: 'BookCreated',
            timestamp: new Date().toISOString(),
            book,
        };

        await this.channel.assertQueue(this.queueName, { durable: true });
        this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(event)), {
            persistent: true,
        });

        console.log(`BookCreated event published to RabbitMQ:`, event);
    }
}

module.exports = BookPublisher;
