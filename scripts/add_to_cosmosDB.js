import { CosmosClient } from '@azure/cosmos';
import https from 'https';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create an HTTPS agent that ignores self-signed certificates
const agent = new https.Agent({
  rejectUnauthorized: false
});

const cosmosClient = new CosmosClient({
    endpoint: 'https://localhost:8081/',
    key: process.env.COSMOS_DB_KEY,
    agent // Use the custom HTTPS agent
  });

// Add one document to CosmosDB
function addDocumentToCosmosDB() {

    const sportsDB = cosmosClient.database('sportsDB');
    const mock_data = sportsDB.container('mock_data');

    const item = {
        id: '10',
        date: '2010-10-10',
        sport: 'Cricket',
        team: 'Team Test'
    };

    mock_data.items.create(item).then((response) => {
        console.log('Document created');
    }).catch((error) => {
        console.error(error);
    });
}


async function deleteDocumentFromCosmosDB(itemId) {
    const sportsDB = cosmosClient.database('sportsDB');
    const container = sportsDB.container('mock_data');
  
    container.item(itemId, itemId).delete().then((response) => {
      console.log(`Document with id ${itemId} deleted`);
    }).catch((error) => {
      console.error(error);
    });
  }

addDocumentToCosmosDB();
//deleteDocumentFromCosmosDB('10');
  