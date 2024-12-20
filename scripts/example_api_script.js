

/* API FUNCTIONS */
async function GetByDate(date) {
    const response = await fetch(`http://localhost:3000/data/${date}`);
    const data = await response.json();
    console.log(data);  
}

async function GetOrgSessionsFromDateToPresent(startDate) {

    const apiUrl = 'http://localhost:3000/data/';
    const apiKey = 'example_api_key';
    let currentDate = new Date(startDate);
    const today = new Date();
  
    while (currentDate <= today) {
      const formattedDate = currentDate.toISOString().split('T')[0];
      //console.log("Fetching data for date:" + formattedDate);
      const response = await fetch(apiUrl + formattedDate, { 
        headers: {
          'Authorization': `Bearer ${apiKey}`, 
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Request error! status: ${response.status}`);
      }
      const responseData = await response.json();
      if (responseData.data.length > 0) {
        console.log(responseData); // Print data to console for now
      }  
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  /* MAIN FUNCTION */
async function main() {
    console.log("Starting script...");
    try {
        // GET data for a specific date
        console.log("Calling endpoint http://localhost:3000/data/${date}");
        await GetByDate("2024-01-01");

        // Get data from a post request
        console.log("Calling endpoint http://localhost:3000/data/ + requestBody");
        // Example usage
        const requestBody = {
            thirdPartyApiId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            sessionStartDate: "2023-11-18T17:26:32.542Z",
            sessionEndDate: "2024-12-18T17:26:32.542Z"
        };
        
        await GetOrgSessionsFromDateToPresent(requestBody.sessionStartDate, requestBody.sessionEndDate, requestBody.thirdPartyApiId);
    
    } catch (err) {
      console.error("Error executing query:", err.message);
    }
  }
  
  main();