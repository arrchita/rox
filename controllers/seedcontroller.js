const express = require('express');
const axios = require('axios');
const Product = require('../models/Product'); 

const router = express.Router();



// API to seed database with data from a third-party API
router.get('/', async (req, res) => {
    try {
        // Fetch data from the third-party API
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const products = response.data;

        // Insert data into the MongoDB collection
        await Product.insertMany(products);
        res.status(200).json({ message: 'Database seeded successfully' });
    } catch (error) {
        console.error('Error seeding database:', error);
        res.status(500).json({ message: 'Failed to seed database' });
    }
});



// API to list all transactions with search and pagination by month
router.get('/transactions', async (req, res) => {
    try {
        // Extract query parameters from the request
        const { month, search = '', page = 1, perPage = 10 } = req.query;

        // Validate the 'month' parameter
        if (!month) {
            return res.status(400).json({ message: "Month parameter is required" });
        }

        // Map month names to month numbers (0 for January, 11 for December)
        const monthMapping = {
            January: 0, February: 1, March: 2, April: 3,
            May: 4, June: 5, July: 6, August: 7,
            September: 8, October: 9, November: 10, December: 11
        };

        // Convert month to the corresponding number
        const monthNumber = monthMapping[month];
        if (monthNumber === undefined) {
            return res.status(400).json({ message: "Invalid month name" });
        }

        // Build query conditions to filter transactions based on the specified month
        const queryConditions = {
            dateOfSale: { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber + 1] } }
        };

        // If a search term is provided, add search conditions to query
        if (search) {
            queryConditions.$or = [
                { title: { $regex: search, $options: 'i' } },          // Search in title
                { description: { $regex: search, $options: 'i' } },    // Search in description
                { price: parseFloat(search) || -1 }                    // Attempt to match price if search is a number
            ];
        }

        // Set up pagination using 'skip' and 'limit'
        const skip = (page - 1) * perPage;
        const limit = parseInt(perPage);

        // Execute the query with pagination
        const products = await Product.find(queryConditions)
            .skip(skip)
            .limit(limit);

        // Count total documents matching the conditions for pagination
        const totalDocuments = await Product.countDocuments(queryConditions);
        const totalPages = Math.ceil(totalDocuments / perPage);

        // Return response with pagination metadata and data
        res.json({
            currentPage: page,
            totalPages,
            totalItems: totalDocuments,
            itemsPerPage: perPage,
            data: products
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Server error" });
    }
});



// API to get statistics for the selected month
router.get('/statistics', async (req, res) => {
    try {
        const month = req.query.month;
        if (!month) {
            return res.status(400).json({ message: 'Month parameter is required' });
        }

        const monthMapping = {
            January: 0, February: 1, March: 2, April: 3,
            May: 4, June: 5, July: 6, August: 7,
            September: 8, October: 9, November: 10, December: 11
        };

        const monthIndex = monthMapping[month];
        if (monthIndex === undefined) {
            return res.status(400).json({ message: 'Invalid month name' });
        }

        const products = await Product.find({
            dateOfSale: { $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex + 1] } }
        });

        const totalSalesAmount = products.reduce((sum, product) => sum + product.price, 0);
        const totalSoldItems = products.filter(product => product.sold).length;
        const totalNotSoldItems = products.filter(product => !product.sold).length;

        res.status(200).json({
            month,
            totalSalesAmount,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ message: 'Failed to fetch statistics' });
    }
});

module.exports = router;
