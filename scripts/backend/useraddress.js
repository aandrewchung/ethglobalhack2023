const fs = require('fs');
const {loadUserDatabase, loadChainDatabase, loadUserChainDatabase, saveToDatabase} = require('../dbscripts/databasefns.js');

//UNIQUE ADDRESS FUNCTIONS
function getUniqueAddressesForChainA(data, chainIndex) {
    const startTime = Date.now();
    const uniqueAddresses = new Set();
  
    for (const userId in data) {
      const chains = data[userId];
      const chainData = chains[chainIndex];
      
      if (chainData) {
        const addresses = chainData.addresses;
        for (const address of addresses) {
          uniqueAddresses.add(address);
        }
      }
    }
  
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    // console.log(`Processing Time for Chain ${chainIndex}: ${processingTime} milliseconds`);
  
    // Convert the set to an array and return the unique addresses
    return Array.from(uniqueAddresses);
}
  
function getUniqueAddressesForChainB(data, chainIndex) {
    const startTime = Date.now();
    const uniqueAddresses = new Set();
  
    Object.values(data).forEach(chains => {
      const chainData = chains[chainIndex];
      if (chainData) {
        const addresses = chainData.addresses;
        addresses.forEach(address => uniqueAddresses.add(address));
      }
    });
  
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    // console.log(`Processing Time for Chain ${chainIndex}: ${processingTime} milliseconds`);
  
    // Convert the set to an array and return the unique addresses
    return Array.from(uniqueAddresses);
}
  
//TEST FUNCTIONS
function testUserAddressesFunctions(userData) {
    //testing 2 fns
    console.time('Function A');
    const arrayA = getUniqueAddressesForChainA(userData, 999);
    console.timeEnd('Function A');

    console.time('Function B');
    const arrayB = getUniqueAddressesForChainB(userData, 999);
    console.timeEnd('Function B');

    // printing arrays
    // console.log(arrayA);
    // console.log(arrayB);
}


function test() {
    //resetting file
    fs.writeFileSync(`databases/chain_user_database.json`, JSON.stringify({}, null, 2));

    //loading database
    const userData = loadUserDatabase();

    //checking unique addy fn's
    testUserAddressesFunctions(userData);
}

// test();


// Export the functions
module.exports = {
    getUniqueAddressesForChainA,
    getUniqueAddressesForChainB,
};
  