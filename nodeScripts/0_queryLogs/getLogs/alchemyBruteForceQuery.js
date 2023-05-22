require('dotenv').config();
const express = require('express');
const Web3 = require('web3');
const web3 = new Web3(process.env.ETH_RPC);

const { abi } = require('@openzeppelin/contracts/build/contracts/ERC20.json');

let contractAddress = '0xf2051511B9b121394FA75B8F7d4E7424337af687';
const arg = process.argv[2];

if (arg != undefined) {
  contractAddress = arg;
  console.log(`Contract Address has been set to: ${contractAddress}`);
  console.log(`https://etherscan.io/address/${arg}`);
} else {
  console.log(`No contract address set. Default is ${contractAddress}`);
}

const contract = new web3.eth.Contract(abi, contractAddress);

const app = express();
const port = 3001;

console.log('Program starting...');

let events = [];
let fromBlockNumber = 0;
let errorCount = 0;

app.get('/', async (req, res) => {
  console.log('\nSOC <(o.o)>-----');
  console.time('Fetch App time');

  try {

    const name = await contract.methods.name().call();
    const symbol = await contract.methods.symbol().call();
    const supply = await contract.methods.totalSupply().call();
    const decimals = await contract.methods.decimals().call();

    const latestBlockNumber = await web3.eth.getBlockNumber();
    let toBlockNumber = latestBlockNumber;
    console.log(`Latest block number: ${latestBlockNumber}`);
    while (fromBlockNumber <= latestBlockNumber) {
      console.log(`Fetching events from block ${fromBlockNumber} to block ${toBlockNumber}...`);
      let eventsBatch;
      try {
        eventsBatch = await contract.getPastEvents('Transfer', {
          fromBlock: fromBlockNumber,
          toBlock: toBlockNumber
        });
        console.log("Success!");
        fromBlockNumber = toBlockNumber +1;
        toBlockNumber = latestBlockNumber;

      } catch (error) {
        errorCount++;
        // console.error(`Error code: ${error.code}. Error message: ${error.message}`);
        // Silencing the full error message.
        console.error(`Error code: ${error.code}.`);
        console.error(`Log response size exceeded.`);

        const regex = /this block range should work: \[(0x[a-fA-F0-9]+), (0x[a-fA-F0-9]+)\]/;
        const match = error.message.match(regex);
        if (match) {
          const newFromBlockNumber = parseInt(match[1]);
          const newToBlockNumber = parseInt(match[2]);
          console.log(`Trying again with block range [${newFromBlockNumber}, ${newToBlockNumber}]`);
          fromBlockNumber = newFromBlockNumber;
          toBlockNumber = newToBlockNumber;
          continue;
        } else {
          res.send('An error occurred');
          return;
        }
      }

      events = events.concat(eventsBatch);

    }

    const eventsLength = events.length;
    res.send({name, symbol, supply, decimals, eventsLength, events});
    console.log(`+++Events length is : ${eventsLength}++++`);
  } catch (error) {
    console.error(error);
    res.send('An error occurred');
  }

  console.timeEnd('Fetch App time');
  console.log('EOC \n---');
  console.log(`${errorCount} error(s) occurred`);

});

app.listen(port, () => {
  console.log(`Listening on localhost:${port}`);
});

console.log('Program ending <(o.o)>');

