const fs = require('fs');
const { isAddress } = require('web3-validator');

// Initialize Web3 with your Ethereum node URL
require('dotenv').config(); // Load environment variables from .env file
const { Web3 } = require('web3');

// Initialize Web3 with your Ethereum node URL
const providerUrl = process.env.CHAIN1_PROVIDER_URL;
const web3 = new Web3(providerUrl);

// Import functions from other files
const {loadUserDatabase, loadChainDatabase, loadUserChainDatabase, saveToUserChainDatabase} = require('../dbscripts/databasefns.js');
const { readContractBytecode } = require('./contractbytecode.js');
const { getUniqueAddressesForChainA, getUniqueAddressesForChainB } = require('./useraddress.js');   

// Import EventEmitter & create event emitter instance
const { EventEmitter } = require('events');
const logEmitter = new EventEmitter();


async function findAddressInBytecode(inputAddress, contractAddress) {
    try {
        //checking if valid address (app its deprecated soon this fn tho)
        if (!isAddress(inputAddress)) {
            return false;
        } else if (!isAddress(contractAddress)) {
            return false;
        } 

        //Read bytecode
        const contractBytecode = await readContractBytecode(contractAddress);

        // Manipulate the inputAddress to get rid of '0x' and convert it to lowercase
        const manipulatedInputAddress = inputAddress.slice(2).toLowerCase();
    
        // Check if the manipulatedInputAddress exists in contractBytecode
        if (contractBytecode.includes(manipulatedInputAddress)) {
            console.log(`True, "${manipulatedInputAddress}" exists!`);
            return true;
        } else {
            console.log(`False, "${manipulatedInputAddress}" does not exist!`);
            return false;
        }
        
    } catch (error) {
        console.error("An error occurred:", error);
        return false;
    }
  }

function getTransactionHash(chainIndex, blockNumber, contractAddress) {
    const databasePath = `databases/chain${chainIndex}_database.json`;

    if (fs.existsSync(databasePath)) {
        const data = fs.readFileSync(databasePath, 'utf8');
        const database = JSON.parse(data);
        if (database[blockNumber] && database[blockNumber][contractAddress]) {
        return database[blockNumber][contractAddress];
        }
    }

    return null; // Transaction hash not found
}

async function printConsoleLog(chainIndex, blockNumber, contractAddress, inputAddress) {
    try {
        const transactionHash = getTransactionHash(chainIndex, blockNumber, contractAddress);
        const block = await web3.eth.getBlock(blockNumber);

        if (!block) {
            console.log("Block not found.");
            return;
        }

        const creationTime = new Date(Number(block.timestamp) * 1000); // Convert Unix timestamp to human-readable date
        const etherscanBaseUrl = "https://etherscan.io";

        const logMessage = "Contract Address: " + contractAddress +
        "\n\nInput Address: " + inputAddress +
        "\n\nChain Index: " + chainIndex +
        "\n\nBlock Number: " + blockNumber +
        "\n\nTransaction Hash: " + transactionHash +
        "\n\nCreation Time: " + creationTime.toISOString() + " (" + creationTime.toLocaleString() + ")" +
        "\n\nTransaction Link: " + etherscanBaseUrl + "/tx/" + transactionHash;
    
        // console.log(logMessage);
        // Emit an event with the log message
        logEmitter.emit('logMessage', { logMessage, chainIndex, inputAddress });
    } catch (error) {
        console.error("Error fetching block details:", error);
    }
}

//Function to loop thru each newly created contracted for the block
async function compareUserWithChain(chainIndex, blockNumber, blockAddresses) {
    console.log("Comparing user chains....")

    const userData = loadUserDatabase();
    const userAddresses = getUniqueAddressesForChainB(userData, chainIndex); // Get unique user addresses based on chain number

    for (const contractAddress of blockAddresses) { //loop thru newly created contract addy's
        for (const inputAddress of userAddresses) { //loop thru the user addresses
            if (await findAddressInBytecode(inputAddress, contractAddress)) {
                printConsoleLog(chainIndex, blockNumber, contractAddress, inputAddress);
                saveToUserChainDatabase(chainIndex, blockNumber, contractAddress, inputAddress); //save to database            
            }
        }
    }
}

module.exports = {
    logEmitter,
    compareUserWithChain,
    // ... (other exported functions)
};

// // Example usage
// const chainIndex = 1;
// const blockNumber = "17442128";
// const contractAddress = "0x05770332d4410b6d7f07fd497e4c00f8f7bfb74a";
// const inputAddress = "0x8D6CeBD76f18E1558D4DB88138e2DeFB3909fAD6";
// printConsoleLog(chainIndex, blockNumber, contractAddress, inputAddress);


