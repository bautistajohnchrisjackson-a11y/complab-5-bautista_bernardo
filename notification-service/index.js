const amqp = require('amqplib');
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

async function startNotificationService() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        
        await channel.assertQueue('order-placed', { durable: true });
        await channel.assertQueue('payment-success', { durable: true });
        
        console.log(" [*] Notification Service waiting for message events...");

        // Listen for new orders placed
        channel.consume('order-placed', (msg) => {
            if (msg !== null) {
                const order = JSON.parse(msg.content.toString());
                console.log(` [🔔 NOTIFICATION] Order received! Sending alert email confirmation for Order ID: ${order.orderId}`);
                channel.ack(msg);
            }
        });

        // Listen for successful payments
        channel.consume('payment-success', (msg) => {
            if (msg !== null) {
                const payment = JSON.parse(msg.content.toString());
                console.log(` [🔔 NOTIFICATION] Payment confirmed! Receipt issued for Order ID: ${payment.orderId}`);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("Notification Service RabbitMQ Error:", error);
    }
}

startNotificationService();
