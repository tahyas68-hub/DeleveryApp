import express from 'express';
import Database from 'better-sqlite3';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- Setup SQLite Database ---
const db = new Database('database.sqlite', { verbose: console.log });

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trackingNumber TEXT UNIQUE NOT NULL,
    customerName TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    amount REAL NOT NULL,
    itemsCount INTEGER NOT NULL,
    cost REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    driver TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// --- API Routes ---

// Get all orders
app.get('/api/orders', (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create a new order
app.post('/api/orders', (req, res) => {
  try {
    const { customerName, phone, city, address, amount, itemsCount, cost } = req.body;
    
    // Generate a simple tracking number
    const trackingNumber = 'TRK-' + Math.floor(10000 + Math.random() * 90000);

    const stmt = db.prepare(`
      INSERT INTO orders (trackingNumber, customerName, phone, city, address, amount, itemsCount, cost, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      trackingNumber,
      customerName,
      phone,
      city,
      address,
      Number(amount) || 0,
      Number(itemsCount) || 1,
      Number(cost) || 0,
      'pending'
    );

    const newOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// --- Vite Integration ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running correctly on port ${PORT}`);
  });
}

startServer();
