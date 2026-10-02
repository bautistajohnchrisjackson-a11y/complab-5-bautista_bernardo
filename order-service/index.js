const express = require('express');
const amqp = require('amqplib');
const app = express();
const PORT = 3002;

app.use(express.json());

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

async function publishOrder(order) {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue('order-placed', { durable: true });
        
        channel.sendToQueue('order-placed', Buffer.from(JSON.stringify(order)), { persistent: true });
        console.log(" [x] Sent order event to 'order-placed' queue:", order);
        
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error("RabbitMQ Error in Order Service:", error);
    }
}

app.post('/orders', async (req, res) => {
    const { item, quantity, amount } = req.body;
    const newOrder = { orderId: Math.floor(Math.random() * 10000), item, quantity, amount, status: 'Pending' };
    
    // Publish event to RabbitMQ
    await publishOrder(newOrder);
    
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
});

app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});
