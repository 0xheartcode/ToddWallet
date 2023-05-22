require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3(process.env.NEW_ETH_RPC);

async function findContractCreationBlock(address) {
  console.time('Searchtime');
  const codeLen = await web3.eth.getCode(address);
  if (codeLen === '0x') {
    throw new Error('Contract does not exist at the given address');
  }

  let startBlock = 0;
  let endBlock = await web3.eth.getBlockNumber();
  let creationBlock = -1;
  let searchCount = 0; // which the current blocknumber the search time is 0 log(n) complexity = 25seconds; 
  while (startBlock <= endBlock && creationBlock === -1) {
    const midBlock = Math.floor((startBlock + endBlock) / 2);
    const codeLen = await web3.eth.getCode(address, midBlock);
    if (codeLen === '0x') {
      startBlock = midBlock + 1;
      console.log(`🔴 Contract does not exists at: ${midBlock}. New midBlock = ${Math.floor((startBlock + endBlock) / 2)}`);
    searchCount++;
    } else {
      const prevCodeLen = await web3.eth.getCode(address, midBlock - 1);
      if (prevCodeLen === '0x') {
        creationBlock = midBlock;
      } else {
        endBlock = midBlock - 1;
        console.log(`🟢 Contract exists at: ${midBlock}. New midBlock = ${Math.floor((startBlock + endBlock) / 2)}`);
        searchCount++;
      }
    }
  }

  if (creationBlock === -1) {
    throw new Error('Could not find contract creation block');
  }
  console.timeEnd('Searchtime');
  console.log(`Search count is: ${searchCount}`);
  return creationBlock;
}

const arg = process.argv[2];
console.log(`The passed argument is: ${arg}`);
console.log(`https://etherscan.io/address/${arg}`);

findContractCreationBlock(arg)
  .then(blockNumber => console.log(`The contract was created in block ${blockNumber}`))
  .catch(error => console.error(`Error: ${error.message}`));

  
