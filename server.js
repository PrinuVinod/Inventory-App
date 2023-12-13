const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Create a database and a table
const db = new sqlite3.Database('inventory.db');
db.run('CREATE TABLE IF NOT EXISTS inventory (itemId INTEGER PRIMARY KEY, itemname TEXT, quantity INTEGER)');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Body parsing middleware to handle POST requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Add item to the database
app.post('/addItem', (req, res) => {
  const { itemname, quantity } = req.body;

  // Insert data into the database
  db.run('INSERT INTO inventory (itemname, quantity) VALUES (?, ?)', [itemname, quantity], function (err) {
    if (err) {
      console.error('Error adding item:', err);
      return res.status(500).json({ error: 'Error adding item' });
    }

    console.log('Item added successfully!');
    res.json({ message: 'Item added successfully!', itemId: this.lastID });
  });
});

// Delete item from the database
app.delete('/deleteItem/:itemId', (req, res) => {
  const { itemId } = req.params;

  // Your delete logic here
  // For example, using your SQLite3 database:
  db.run('DELETE FROM inventory WHERE itemId = ?', [itemId], function (err) {
    if (err) {
      console.error('Error deleting item:', err);
      return res.status(500).json({ error: 'Error deleting item' });
    }

    console.log('Item deleted successfully!');
    res.json({ message: 'Item deleted successfully!' });
  });
});

// Retrieve items from the database
app.get('/getItems', (req, res) => {
  // Select all data from the database
  db.all('SELECT * FROM inventory', (err, rows) => {
    if (err) {
      console.error('Error retrieving items:', err);
      return res.status(500).json({ error: 'Error retrieving items' });
    }

    res.json({ items: rows });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
