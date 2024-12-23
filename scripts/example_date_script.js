import db from '../databases/sqliteDB.js';
import readline from 'readline';

/* This file uses the sqliteDB.js and creates example queries to fetch data from the database. */
/* The queries are then printed to the console. */
/* No mock API is used in this file. */

/* ALL DATA FUNCTIONS */
function queryAllData() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM mock_data", (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

async function printAllData(){
    const allData = await queryAllData();
    console.log("All Data in Temp DB:");
    console.log(allData, "\n");
}

/* SPECIFIC DAY QUERY FUNCTIONS */
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

async function printDataByDate(date) {
  const result = await queryDataByDate(date);
  console.log("Query Result for date " + date + ":");
  console.log(result, "\n");
}

/* SPECIFIC MONTH QUERY FUNCTIONS */
function queryDataByMonth(startDate) {

  // Set Start Date to first day of the month and End Date to first day of the next month
  startDate = startDate.split('-').slice(0, 2).join('-') + '-01';
  var endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);
  endDate.setDate(endDate.getDate() - 1);

  return queryDataByStartDate(startDate, endDate.toISOString().split('T')[0]);
}

async function printDataByMonth(startDate) {
  const result = await queryDataByMonth(startDate);
  console.log("Query Result for month of date " + startDate + ":");
  console.log(result, "\n");
}

/* DATE RANGE QUERY FUNCTIONS */
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

async function printDataByStartDate(startDate, endDate) {
  const result = await queryDataByStartDate(startDate, endDate);
  console.log("Query Result for date range " + startDate + " to " + endDate + ":");
  console.log(result, "\n");
}

/* DATE TO PRESENT QUERY FUNCTIONS */
function queryDataFromDateToPresent(startDate) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM mock_data WHERE date >= ?", [startDate], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

async function printDataFromDateToPresent(startDate) {
  const result = await queryDataFromDateToPresent(startDate);
  console.log("Query Result for date " + startDate + " to present:");
  console.log(result, "\n");
}

/* HELPER FUNCTIONS */
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

/* MAIN FUNCTION */
async function main() {
  printCurrentDate();

  // Dates to query
  const date0 = "2023-12-31";
  const date1 = "2024-01-01";

  try {
    await printAllData();    
    await printDataByDate(date1);
    await printDataByMonth(date1);
    await printDataByStartDate(date0, date1);
    await printDataFromDateToPresent(date1);
   
    //manualQuery();

  } catch (err) {
    console.error("Error executing query:", err.message);
  }
}

main();