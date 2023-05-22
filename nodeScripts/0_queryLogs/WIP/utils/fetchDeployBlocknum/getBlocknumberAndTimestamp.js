require('dotenv').config()
const Web3 = require('web3');
const rpcEndpoint = process.env.ETH_RPC;
const web3 = new Web3(rpcEndpoint);

async function getBlockTimestamp() {
  const blockNumber = await web3.eth.getBlockNumber();
  const block = await web3.eth.getBlock(blockNumber);
  const timestamp = block.timestamp;
  const date = new Date(timestamp * 1000).toLocaleString();
  const currentDate = new Date().toLocaleString();
  console.log(`Blocknumber: ${blockNumber}`);
  console.log(`Block timestamp: ${date}`);
  // console.log(`Current date and time: ${currentDate}`);
}

getBlockTimestamp();

