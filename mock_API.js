import express from 'express';
import db from './database.js';

const app = express();
const port = 3000;

// Endpoint to get data for a given date
app.get('/data/:date', (req, res) => {
  const date = req.params.date;
  
  db.all("SELECT * FROM mock_data WHERE date = ?", [date], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: rows });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});