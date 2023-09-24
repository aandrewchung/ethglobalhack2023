// ------------------- Imports -------------------

const fs = require('fs');
const { isAddress } = require('web3-validator');
const {loadUserDatabase} = require('./databasefns.js');

// ------------------- Validation Functions -------------------

/**
 * Validates user and chain IDs.
 *
 * @param {string} userID - The user's ID
 * @param {string} chainID - The chain's ID
 * @returns {string[]} An array of error messages if validation fails, otherwise an empty array.
 */
function validateIDs(userID, chainID) {
    const parsedUserID = parseInt(userID);
    const parsedChainID = parseInt(chainID);

    // const data = loadUserDatabase();
    
    // if (!data) {
    //     return ['Database is empty.'];
    // }

    const errors = [];

    if (isNaN(parsedUserID)) {
        errors.push(`Invalid userID: ${userID}`);
    }

    // if (!data[userID]) {
    //     errors.push(`User with ID ${userID} does not exist.`);
    // }

    if (isNaN(parsedChainID)) {
        errors.push(`Invalid chainID: ${chainID}`);
    }

    // if (!data[userID][chainID]) {
    //     errors.push(`Chain with ID ${chainID} does not exist for userID ${userID}.`);
    // }

    return errors;
}

/**
 * Validates contract addresses using web3-validator.
 *
 * @param {string[]} addresses - An array of user inputted contract addresses
 * @returns {string[]} An array of error messages if validation fails, otherwise an empty array.
 */
function validateAddresses(addresses) {
    const errors = []

    // Validate addresses using web3
    for (const address of addresses) {
        if (!isAddress(address)) {
            errors.push(`Invalid address: ${address}`);
        }
    }

    return errors;
}

/**
 * Validates user inputs, including IDs and addresses.
 *
 * @param {string} userID - The user's ID
 * @param {string} chainID - The chain's ID
 * @param {string[]} addresses - An array of user inputted contract addresses
 * @returns {{error: boolean, message: string}} An object indicating whether validation failed and an associated error message.
 */
function validateInputs(userID, chainID, addresses) {
    const validationErrors = [...validateIDs(userID, chainID), ...validateAddresses(addresses)];

    if (validationErrors.length > 0) {
        const errorMessage = "Error with your inputs:\n\n" + validationErrors.join("\n");
        console.log(errorMessage); // Log the error message to the console
        return { error: true, message: errorMessage };
    }

    return { error: false }; // Both userID, chainID, and addresses are valid
}


// ------------------- User Database Functions -------------------

/**
 * Saves user inputted addresses to the user database.
 *
 * @param {string} userID - The user's ID
 * @param {string} chainID - The chain's ID
 * @param {string[]} addresses - An array of user inputted contract addresses
 * @returns {{error: boolean, message: string}} An object indicating whether the operation failed and an associated error message.
 */
function saveToUser(userID, chainID, addresses) {
    const validationResult = validateInputs(userID, chainID, addresses);

    if (validationResult.error) {
        // Use the error message from the validationResult
        const errorMessage = validationResult.message;
        console.log(errorMessage); // Log the error message to the console
        return { error: true, message: errorMessage };
    }

    const filePath = `databases/user_database.json`;
    let data = loadUserDatabase();

    if (!data) {
        data = {};
    }

    const userData = data[userID] || {};
    const chainData = userData[chainID] || {};

    chainData.addresses = chainData.addresses || [];

    // Prevent adding duplicates
    const uniqueAddressesToAdd = addresses.filter(address => !chainData.addresses.includes(address));
    
    chainData.addresses.push(...uniqueAddressesToAdd);
    userData[chainID] = chainData;
    data[userID] = userData;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return { error: false }; // No error occurred
}

/**
 * Removes user inputted addresses from the user database file.
 *
 * @param {string} userID - The user's ID to remove addresses from.
 * @param {string} chainID - The chain's ID to remove addresses from.
 * @param {string[]} addresses - An array of addresses to be removed.
 * @returns {{error: boolean, message: string}} An object indicating whether the operation failed and an associated error message.
 */
function removeFromUser(userID, chainID, addresses) {
    const filePath = `databases/user_database.json`;
    let data = loadUserDatabase();

    if (!data) {
        data = {};
    }

    const userData = data[userID];
    const chainData = userData[chainID];
    chainData.addresses = chainData.addresses || [];

    // Filter addresses that exist in the chain's addresses array
    const filteredAddresses = chainData.addresses.filter(address => !addresses.includes(address));

    // Check if any addresses were removed
    if (chainData.addresses.length !== filteredAddresses.length) {
        chainData.addresses = filteredAddresses;
        userData[chainID] = chainData;
        data[userID] = userData;

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        return { error: false }; // No error occurred
    } else {
        const nonExistentAddresses = addresses.filter(address => !chainData.addresses.includes(address));
        const errorMessage = `The following addresses do not exist in the chain: ${nonExistentAddresses.join(', ')}`;
        return { error: true, message: errorMessage };
    }
}

// ------------------- User Database Functions -------------------
/**
 * Adds a new user entry to the user database based on the provided user ID.
 *
 * @param {string} userID - The user's ID to be added.
 * @returns {{error: boolean, message: string}} An object indicating whether the operation failed and an associated error message.
 */
function addUser(userID) {
    const filePath = `databases/user_database.json`;
    let data = loadUserDatabase();

    if (!data) {
        data = {};
    }

    if (!data[userID]) {
        data[userID] = {};
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return { error: false }; // No error occurred
    } else {
        const errorMessage = `User ID ${userID} already exists in the database.`;
        console.log(errorMessage); // Log the error message to the console
        return { error: true, message: errorMessage };
    }
}

/**
 * Removes an entire user entry from the user database based on the provided user ID.
 *
 * @param {string} userID - The user's ID to be removed.
 * @returns {{error: boolean, message: string}} An object indicating whether the operation failed and an associated error message.
 */
function removeUser(userID) {
    const filePath = `databases/user_database.json`;
    let data = loadUserDatabase();

    if (!data) {
        data = {};
    }

    if (data[userID]) {
        delete data[userID];
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return { error: false }; // No error occurred
    } else {
        const errorMessage = `User ID ${userID} not found in the database.`;
        console.log(errorMessage); // Log the error message to the console
        return { error: true, message: errorMessage };
    }
}




// ------------------- Test -------------------

// Example usage
const userId = "1";
const chainId = "1";
const addressesToAdd = [
    "0xtest1",
    "0xtest2",
    "0xtest3",
    "0xtest4",
    "0x10030",
    "0x8D6CeBD76f18E1558D4DB88138e2DeFB3909fAD6"
];

// Add addresses to the user's chain
// removeFromUser(userId, chainId, addressesToAdd);

// addUser(5);
// removeUser(5);

// ------------------- Module Exports -------------------

module.exports = {
    saveToUser,
    removeFromUser,
    addUser,
    removeUser
};