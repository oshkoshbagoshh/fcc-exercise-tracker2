const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');


// Initialize the data store
async function initializeDataStore() {
    try {
        await fs.access(DATA_FILE);

    } catch (error) {
        // file doesn't exist, create it with an empty object
        await fs.writeFile(DATA_FILE, JSON.stringify({}));

    }
}

//  Read the data from the JSON file