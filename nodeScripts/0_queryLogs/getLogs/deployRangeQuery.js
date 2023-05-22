require('dotenv').config(); 
const deployBlockModule = require('./utils/moduleQueryDeployBlock.js');

const express = require('express');
const Web3 = require('web3');
const web3 = new Web3(process.env.NEW_ETH_RPC);
 
const { abi } = require('@openzeppelin/contracts/build/contracts/ERC20.json');

const arg = process.argv[2];
const argTwo = process.argv[3];

let contractAddress = '0xf2051511B9b121394FA75B8F7d4E7424337af687';

if (arg != undefined) {
  contractAddress = arg;
  console.log(`Contract Address has been set to: ${contractAddress}`);
  console.log(`https://etherscan.io/address/${arg}`);
} else {
  console.log(`No contract address set. Default is ${contractAddress}`);
}

const contract = new web3.eth.Contract(abi, contractAddress);
 
const app = express();
const port = 3000;
 
console.log(`The address you shared is: ${contractAddress}`);
console.log('⏳ Fetch Range Query initiated...');

let events = [];
let fromBlockNumber = 0;
let batchSize = 2000;

if (argTwo != undefined) {
  batchSize = parseInt(argTwo);
  console.log(`Batchsize has been set to: ${batchSize}`);
} else {
  console.log(`No batchsize set. Default is ${batchSize}`);
}

app.get('/', async (req, res) => {
  console.log('\n( ˘ ³˘)>♥ Sending love to the blockchain-----');
  console.time('Fetch App time');


  try {

    const name = await contract.methods.name().call();
    const symbol = await contract.methods.symbol().call();
    const supply = await contract.methods.totalSupply().call(); 
    const latestBlockNumber = await web3.eth.getBlockNumber();
    const decimals = await contract.methods.decimals().call();

    // fetching the deployment blocknumber here:
    const deploymentBlock = await deployBlockModule.findContractCreationBlock(contractAddress);

    console.log(`Latest block number: ${latestBlockNumber}`);
    console.log(`Deployment block number: ${deploymentBlock}`);
    fromBlockNumber = deploymentBlock;

    while (fromBlockNumber <= latestBlockNumber) {

      console.log(`Fetching events from block ${fromBlockNumber} to block ${fromBlockNumber + batchSize - 1}...`);
      const eventsBatch = await contract.getPastEvents('Transfer', {
        fromBlock: fromBlockNumber,
        toBlock: Math.min(fromBlockNumber + batchSize - 1, latestBlockNumber)
      });

      events = events.concat(eventsBatch);

      fromBlockNumber += batchSize;
    }


    const eventsLength = events.length;
    res.send({name, symbol, supply, decimals, eventsLength, events});
 
  } catch (error) {
    console.error(error);
    res.send('An error occurred');
  }

  console.log('♥<(˘Ɛ˘) Received love from the blockchain-----');
  console.log('✅ Fetch Range Query ending.');
  console.timeEnd('Fetch App time');
});

app.listen(port, () => {
  console.log(`Listening on localhost:${port}`);
});


