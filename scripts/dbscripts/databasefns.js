const fs = require('fs');

//FILE FUNCTIONS

// Function to load user data from the JSON database file
function loadUserDatabase() {
    const filePath = `databases/user_database.json`;
  
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  
    return null;
}

// Function to load contract addresses from the JSON database file
function loadChainDatabase(chainIndex) {
    const filePath = `databases/chains/chain${chainIndex+1}_database.json`;
  
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  
    return null;
}

// Function to load info where there a user addy is referenced from the JSON database file
function loadUserChainDatabase() {
    const filePath = `databases/chain_user_database.json`;
  
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  
    return null;
}

function saveToUserChainDatabase(chainIndex, blockNumber, contractAddress, userAddress) {
    const filePath = `databases/chain_user_database.json`;
    let data = loadUserChainDatabase();

    if (!data) {
        data = {};
    }

    const chainData = data[chainIndex] || {};
    const blockData = chainData[blockNumber] || {};

    if (Array.isArray(blockData[contractAddress])) {
        // Check if the userAddress is not already in the array
        if (!blockData[contractAddress].includes(userAddress)) {
            blockData[contractAddress].push(userAddress);
        }
    } else {
        blockData[contractAddress] = [userAddress];
    }

    chainData[blockNumber] = blockData;
    data[chainIndex] = chainData;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Function to save contract addresses to the JSON database file
function saveToChainDB(chainIndex, blockNumber, contractAddresses, txHashAddresses) {
    const filePath = `databases/chains/chain${chainIndex + 1}_database.json`;
    let data = loadChainDatabase(chainIndex);
  
    if (!data) {
      data = {};
    }
  
    if (!data[blockNumber]) {
      data[blockNumber] = {};
    }
  
    for (let i = 0; i < contractAddresses.length; i++) {
      const contractAddress = contractAddresses[i];
      const txHash = txHashAddresses[i];
      data[blockNumber][contractAddress] = txHash;
    }
  
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Chain ${chainIndex + 1}: Block ${blockNumber} contracts saved to database.`);
}


// Export the functions
module.exports = {
    loadUserDatabase,
    loadChainDatabase,
    loadUserChainDatabase,
    saveToUserChainDatabase,
    saveToChainDB,
  };