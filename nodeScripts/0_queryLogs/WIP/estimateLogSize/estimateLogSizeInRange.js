require('dotenv').config();
const Web3 = require('web3');

const web3 = new Web3(process.env.ETH_RPC);

const { abi } = require('@openzeppelin/contracts/build/contracts/ERC20.json');

const contractAddress = "0x9553ee07e6970af0085bb3ac8b3eacd058548c70";

async function estimateLogsInRange(startBlockNumber, endBlockNumber, contractAddress) {
  const contract = new web3.eth.Contract(abi, contractAddress);
  const filter = {
    fromBlock: startBlockNumber,
    toBlock: endBlockNumber,
    // specify the name of the event you're interested in
    // instead of 'allEvents'
    topics: [web3.utils.sha3('Transfer(address,address,uint256)')]
  };
  const logs = await contract.getPastEvents('Transfer', filter);
  const logsCount = logs.length;
  return logsCount;
}

async function main() {
  const startBlockNumber = 0;
  const endBlockNumber = await web3.eth.getBlockNumber();
  // const endBlockNumber = 16339180;
  const logsCount = await estimateLogsInRange(startBlockNumber, endBlockNumber, contractAddress);
  console.log(`The estimated number of logs in the range from block ${startBlockNumber} to block ${endBlockNumber} is ${logsCount}`);
}

main();

