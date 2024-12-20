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

async function setupCosmosDB() {
  const { database } = await cosmosClient.databases.createIfNotExists({
    id: 'sportsDB',
    throughput: 400
  });

  const { container } = await database.containers.createIfNotExists({
    id: 'mock_data',
    partitionKey: {
      paths: ['/id']
    }
  });

  // Insert mock data
  const sports = ["Soccer", "Basketball", "Baseball", "Hockey", "Tennis"];
  const teams = ["Team AA", "Team BB", "Team CC", "Team DD", "Team EE"];

 // check if the database is empty
  const { resources: items } = await container.items.readAll().fetchAll();
  if (items.length > 0) {
    console.log("Database already contains data, skipping mock data insertion");
    return;
  } else {
    
    for (let i = 0; i < 5; i++) {
      let mockDate = new Date();
      mockDate.setFullYear(mockDate.getFullYear() - 1);
      mockDate.setMonth(11); // 0-11 (December)
      mockDate.setDate(i % 3 + 1); // Ensure valid date

      const item = {
        id: (i + 1).toString(),
        date: mockDate.toISOString().split('T')[0],
        sport: sports[i % 5],
        team: teams[i % 5]
      };

      await container.items.create(item);
    }

    console.log("Mock data inserted into Cosmos DB");
  }
}

setupCosmosDB().catch(console.error);