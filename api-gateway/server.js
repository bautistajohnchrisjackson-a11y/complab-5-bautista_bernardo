const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// Basic routing log
app.get('/', (req, res) => {
    res.json({ message: "API Gateway is running" });
});

// Route to check gateway status
app.get('/status', (req, res) => {
    res.json({ service: "API Gateway", status: "Healthy" });
});

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
