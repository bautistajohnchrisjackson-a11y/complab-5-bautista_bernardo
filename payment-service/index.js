const amqp = require('amqplib');
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

async function startPaymentService() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        
        await channel.assertQueue('order-placed', { durable: true });
        await channel.assertQueue('payment-success', { durable: true });
        
        console.log(" [*] Payment Service waiting for messages in 'order-placed' queue...");

        channel.consume('order-placed', (msg) => {
            if (msg !== null) {
                const order = JSON.parse(msg.content.toString());
                console.log(` [x] Processing payment for Order ID: ${order.orderId} ($${order.amount})`);
                
                // Simulate payment processing logic
                const paymentDetails = { orderId: order.orderId, paymentId: Math.floor(Math.random() * 99999), status: 'Completed' };
                
                // Publish to payment-success queue
                channel.sendToQueue('payment-success', Buffer.from(JSON.stringify(paymentDetails)), { persistent: true });
                console.log(` [x] Payment successful. Sent event to 'payment-success' queue.`);
                
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("Payment Service RabbitMQ Error:", error);
    }
}

startPaymentService();
