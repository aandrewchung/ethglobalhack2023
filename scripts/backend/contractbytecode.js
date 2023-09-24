// Initialize Web3 with your Ethereum node URL
require('dotenv').config(); // Load environment variables from .env file
const { Web3 } = require('web3');

// Initialize Web3 with your Ethereum node URL
const providerUrl = process.env.CHAIN1_PROVIDER_URL;
const web3 = new Web3(providerUrl);

// Function to read contract bytecode
async function readContractBytecode(contractAddress) {
  try {
    // Get the contract's code from the blockchain
    const bytecode = await web3.eth.getCode(contractAddress);
    // const first10Chars = bytecode.substring(0, 10); //only printing 10 characters for now

    // Log the bytecode
    // console.log('Contract Bytecode:', first10Chars);

    return bytecode;
  } catch (error) {
    console.error('Error reading contract bytecode:', error);
  }
}

// Contract address to fetch bytecode from
// const contractAddress = '0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413';
const contractAddress = "0x05770332D4410b6D7f07Fd497E4c00F8F7bFb74A"; //smart contract that was created in new block
const referencedAddress = "0x8D6CeBD76f18E1558D4DB88138e2DeFB3909fAD6";
// Call the function to read the contract bytecode
// readContractBytecode(contractAddress);



// Export the functions
module.exports = {
  readContractBytecode,
};
