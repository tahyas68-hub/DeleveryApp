import express from 'express';
import Database from 'better-sqlite3';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const excelCache = new Map<string, { buffer: Buffer, fileName: string, timestamp: number }>();

// Clean up old cached files periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of excelCache.entries()) {
    if (now - value.timestamp > 1000 * 60 * 10) { // 10 minutes
      excelCache.delete(key);
    }
  }
}, 1000 * 60 * 5);

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

// Upload Excel Blob (Base64) to get a downloadable link
app.post('/api/upload-excel', (req, res) => {
  try {
    const { base64, fileName } = req.body;
    if (!base64 || !fileName) {
      return res.status(400).json({ error: 'Missing base64 or fileName' });
    }
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const buffer = Buffer.from(base64, 'base64');
    excelCache.set(id, { buffer, fileName, timestamp: Date.now() });
    res.json({ downloadUrl: `/api/download-excel/${id}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload export' });
  }
});

app.get('/api/download-excel/:id', (req, res) => {
  const file = excelCache.get(req.params.id);
  if (!file) {
    return res.status(404).send('File not found or expired');
  }
  // This header forces the browser/WebView native DownloadManager to start downloading
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.fileName)}"`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(file.buffer);
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
