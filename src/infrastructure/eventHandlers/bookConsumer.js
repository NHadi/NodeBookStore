const amqp = require('amqplib');

class BookConsumer {
    constructor(bookApplicationService, queueName = 'book_queue') {
        this.queueName = queueName;
        this.channel = null;
        this.bookApplicationService = bookApplicationService; // Inject the service to handle events
    }

    async connectRabbitMQ() {
        try {
            console.log("Connecting to RabbitMQ for consuming...");
            const connection = await amqp.connect('amqp://rabbitmq');
            this.channel = await connection.createChannel();
            console.log("RabbitMQ connected for consuming");
        } catch (error) {
            console.error('Failed to connect to RabbitMQ for consuming:', error);
            throw new Error('RabbitMQ connection failed');
        }
    }

    async startRabbitMQConsumer() {
        if (!this.channel) {
            throw new Error('RabbitMQ channel is not initialized for consuming');
        }

        await this.channel.assertQueue(this.queueName, { durable: true });
        this.channel.consume(this.queueName, async (message) => {
            if (message !== null) {
                console.log('Message received from RabbitMQ:', message.content.toString());
                const event = JSON.parse(message.content.toString());
                await this.bookApplicationService.handleBookCreatedEvent(event); // Handle event in app service
                this.channel.ack(message); // Acknowledge the message after processing
            }
        }, { noAck: false });

        console.log('RabbitMQ Consumer started');
    }
}

module.exports = BookConsumer;
