import express = require('express');
import pool from './database.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Test database connection
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ 
      status: 'OK', 
      message: 'Database connected successfully',
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});