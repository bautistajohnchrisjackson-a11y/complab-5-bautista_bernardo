const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

// Mock database data
const inventory = [
    { id: 1, item: "Laptop", stock: 15 },
    { id: 2, item: "Mouse", stock: 120 }
];

app.get('/inventory', (req, res) => {
    res.json(inventory);
});

app.listen(PORT, () => {
    console.log(`Inventory Service running on port ${PORT}`);
});
