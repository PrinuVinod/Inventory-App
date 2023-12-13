const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

const uri = 'mongodb+srv://prinuvinod:<password>@cluster0.qp044fw.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB connection string
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to the database');
    db = client.db('Inventory'); // Replace with your database name
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

connectToDatabase();

// Rest of your server code...

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});