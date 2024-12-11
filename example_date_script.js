import db from './database.js';
import readline from 'readline';

function queryDataByDate(date) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM mock_data WHERE date = ?", [date], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function queryDataByStartDate(startDate, endDate) {
  return new Promise((resolve, reject) => {
    let query = "SELECT * FROM mock_data WHERE date >= ?";
    let params = [startDate];

    if (endDate) {
      query += " AND date <= ?";
      params.push(endDate);
    }

    db.all(query, params, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function printCurrentDate() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1; // 0-11
  var day = date.getDate();
  
  console.log("Current Date:");
  console.log("Year:", year, "Month:", month, "Day:", day, "\n");
}

function manualQuery() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter a custom SQL query? (Y/N) ', (answer) => {
    if (answer.toUpperCase() === 'Y') {
      rl.question('Enter your SQL query: ', (query) => {
        db.all(query, [], (err, rows) => {
          if (err) {
            console.error("Error executing query:", err.message);
          } else {
            console.log("Query Result:");
            console.log(rows, "\n");
          }
          rl.close();
        });
      });
    } else {
      console.log("Exiting manual query mode.");
      rl.close();
    }
  });
}

async function main() {
  printCurrentDate();

  try {
    const result1 = await queryDataByDate("2022-11-01");
    console.log("Query Result for date 2022-11-01:");
    console.log(result1, "\n");

    const result2 = await queryDataByStartDate("2022-11-01", "2022-12-01");
    console.log("Query Result for date range 2022-11-01 to 2022-12-01:");
    console.log(result2, "\n");

    manualQuery();
  } catch (err) {
    console.error("Error executing query:", err.message);
  }
}

main();