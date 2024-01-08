const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_CONNECT_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const inventorySchema = new mongoose.Schema({
  itemname: String,
  quantity: Number,
  unit: String,
});

const Inventory = mongoose.model('Inventory', inventorySchema);

app.get('/service-worker.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'PWA', 'service-worker.js'));
});

app.post('/addItem', async (req, res) => {
  try {
    const { itemname, quantity, unit } = req.body;
    const newItem = new Inventory({ itemname, quantity, unit });
    await newItem.save();
    res.json({ message: 'Item added successfully!' });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Error adding item' });
  }
});

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

app.get('/getItems', async (req, res) => {
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
