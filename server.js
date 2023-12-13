const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

mongoose.connect('mongodb+srv://prinuvinod:BlahBlah123@cluster0.qp044fw.mongodb.net/Cluster0?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define the schema for the inventory item
const inventorySchema = new mongoose.Schema({
  itemname: String,
  quantity: Number,
});

// Create a model based on the schema
const Inventory = mongoose.model('Inventory', inventorySchema);

// Route to add an item
app.post('/addItem', async (req, res) => {
  try {
    const { itemname, quantity } = req.body;
    const newItem = new Inventory({ itemname, quantity });
    await newItem.save();
    res.json({ message: 'Item added successfully!' });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Error adding item' });
  }
});

// Route to delete an item
app.delete('/deleteItem/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    await Inventory.findByIdAndDelete(itemId);
    res.json({ message: 'Item deleted successfully!' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Error deleting item' });
  }
});

// Route to get all items
app.post('/getItems', async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json({ items });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Error fetching items' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
