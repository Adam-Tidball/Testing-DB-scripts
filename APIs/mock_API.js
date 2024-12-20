import express from 'express';
import db from '../databases/sqliteDB.js';

const app = express();
const port = 3000;

/* This API connects to SQLite DB */
app.use(express.json()); // Parse JSON bodies

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

// Endpoint to get data for a given date range (based on statsport)
app.post('/data/', (req, res) => {
  const { thirdPartyApiId, sessionStartDate, sessionEndDate } = req.body;

  //res.json(thirdPartyApiId);
  db.all("SELECT * FROM mock_data WHERE date >= ? AND date <= ?", [sessionStartDate, sessionEndDate], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: rows });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});