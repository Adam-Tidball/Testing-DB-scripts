import sqlite3 from 'sqlite3';
const db = new sqlite3.Database(':memory:'); // DB is temp and will be deleted after the process ends

db.serialize(() => {
  db.run("CREATE TABLE mock_data (id INT, date TEXT, sport TEXT, team TEXT)");

  const stmt = db.prepare("INSERT INTO mock_data VALUES (?, ?, ?, ?)");
  const sports = ["Soccer", "Basketball", "Baseball", "Hockey", "Tennis"];
  const teams = ["Team A", "Team B", "Team C", "Team D", "Team E"];

  for (let i = 0; i < 5; i++) {
    let mockDate = new Date();
    mockDate.setFullYear(mockDate.getFullYear() - 1);
    mockDate.setMonth(mockDate.getMonth() + i);
    stmt.run(i + 1, mockDate.toISOString().split('T')[0], sports[i], teams[i]);
  }

  stmt.finalize();
});

export default db;