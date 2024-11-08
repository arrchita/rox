const express = require('express');
const connectDB = require('./config/db.js');

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());

// Import routes
const seedRouter = require('./controllers/seedcontroller');
app.use('/api/seed', seedRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
