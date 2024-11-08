# Product Transactions API

This project is a backend solution for managing product transaction data. 

## Project Overview

The API provides functionality for:
1. **Database Initialization**: Fetching product transaction data from a third-party API and initializing the local database with this data.
2. **Transaction Retrieval**: Fetching product transactions with support for search and pagination.
3. **Statistics Calculation**: Providing statistical insights on sales data for a specified month.

## Table of Contents
- [Technologies]
- [Setup]
- [Endpoints]
- [Usage]
- [Directory Structure]

## Technologies

- **Node.js**: Backend runtime environment
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database for storing product transactions
- **Mongoose**: ODM for MongoDB and Node.js

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the project root and specify the following environment variables:

   ```plaintext
   DATABASE_URL=<Your MongoDB connection string>
   THIRD_PARTY_API_URL=https://s3.amazonaws.com/roxiler.com/product_transaction.json
   PORT=5000
   ```

3. **Initialize Database**:
   Use the database initialization endpoint to fetch and seed data from the third-party API.

## Endpoints

### 1. Database Initialization
**`GET /api/initialize`**
- **Purpose**: Fetch data from the third-party API and initialize the local database.
- **Method**: `GET`
- **Response Format**: JSON

### 2. List Transactions
**`GET /api/transactions`**
- **Purpose**: List transactions with search and pagination support.
- **Query Parameters**:
  - `page` (default: `1`)
  - `perPage` (default: `10`)
  - `search` (optional): Searches in product title, description, or price.
  - `month` (required): Month of the transaction to filter on.
- **Response Format**: JSON

### 3. Statistics
**`GET /api/statistics`**
- **Purpose**: Retrieve monthly statistics including:
  - Total sale amount of selected month
  - Total number of sold items in selected month
  - Total number of not sold items in selected month
- **Query Parameters**:
  - `month` (required): Month for which statistics are calculated.
- **Response Format**: JSON

## Usage

- **Start Server**:
  ```bash
  npm start
  ```

- **Example Requests**:
  - List Transactions: `GET /api/transactions?month=January&page=1&perPage=10`
  - Get Statistics: `GET /api/statistics?month=January`

- **Results:**:
![Screenshot 2024-11-07 194702](https://github.com/user-attachments/assets/70829a55-1529-45bf-87e9-be9d409b9b93)
![Screenshot 2024-11-07 195905](https://github.com/user-attachments/assets/8bdbfe54-7e50-43c1-a6ed-8b5e2c7138f9)

