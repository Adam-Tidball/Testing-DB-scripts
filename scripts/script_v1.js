import { CosmosClient } from '@azure/cosmos';
import https from 'https';
import dotenv from 'dotenv';

// Script info:
// Given a date range, this script adds all data returned from the API to CosmosDB

// Local Development Configuration
dotenv.config(); // Load environment variables from .env file
const agent = new https.Agent({  // Ignore local self-signed error 
  rejectUnauthorized: false
});

// CosmosDB client
var client = new CosmosClient({
    endpoint: 'https://localhost:8081/', /* REPLACE WITH REAL ENDPOINT */
    key: process.env.COSMOS_DB_KEY, /* REPLACE WITH REAL KEY */
    agent /* Only needed for Local Developement */
});

const cosmos_database = client.database('sportsDB'); /* REPLACE WITH REAL DATABASE NAME */
const cosmos_container = cosmos_database.container('mock_data'); /* REPLACE WITH REAL CONTAINER NAME */

// Function to fetch data from API 
/* UPDATE WITH REAL STATSPORT API INFO */
async function callStatSportDateRangeAPI(startDate, endDate) {
    const response = await fetch(`http://localhost:3000/data/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            thirdPartyApiId: process.env.THIRD_PARTY_API_ID,
            sessionStartDate: startDate,
            sessionEndDate: endDate
        })
    });

    if (!response.ok) {
        throw new Error(`Request error! status: ${response.status}`);
    }

    return await response.json();
}

// Function to add item to cosmosDB
async function addDocumentToCosmosDB(item) {
    cosmos_container.items.create(item).then((response) => {
        console.log('Document created');
    }).catch((error) => {
        console.error(error);
    });
}


// Main Function of the Script
async function GetOrgSessionsFromDateToPresent() {

    // Call the API (expecting an array of data)]
    const startDate = "2023-11-18";
    const endDate = new Date(); // Current date
    console.log("Fetching data from API for date range: ", startDate, " to ", endDate);
    const responseData = await callStatSportDateRangeAPI(startDate, endDate);

    // Add response data to CosmosDB
    if (responseData.data.length > 0) {
      
      for (const entry of responseData.data) {
        // Response data requires an id field to be used as the key in CosmosDB
        const item = {
          ...entry,
          id: String(entry.id)
        };
        console.log(item);
        await addDocumentToCosmosDB(item);
      }
      
    }
}


GetOrgSessionsFromDateToPresent();
  