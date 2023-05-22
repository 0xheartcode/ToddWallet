require('dotenv').config();                                                                          
const express = require('express');
const Web3 = require('web3');
const web3 = new Web3(process.env.NEW_ETH_RPC);
 
const { abi } = require('@openzeppelin/contracts/build/contracts/ERC20.json');

const arg = process.argv[2];
const argTwo = process.argv[3];

const contractAddress = arg;
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
    console.log(`Latest block number: ${latestBlockNumber}`);
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
    res.send({name, symbol, supply, eventsLength, events});
 
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


