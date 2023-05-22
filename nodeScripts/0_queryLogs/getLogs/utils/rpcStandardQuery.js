require('dotenv').config()
const express = require('express');
const Web3 = require('web3');
const web3 = new Web3(process.env.NEW_ETH_RPC);
const { abi } = require('@openzeppelin/contracts/build/contracts/ERC20.json');


const arg = process.argv[2];

// const contractAddress = process.env.ADDRESS;
const contractAddress = arg;
const contract = new web3.eth.Contract(abi, contractAddress);

const app = express();
const port = 3000;

console.log(`The adress you shared is: ${contractAddress}`);
console.log('⏳ Fetch Standard Query initiated...');


app.get('/', async (req, res) => {
  console.log('\n( ˘ ³˘)>♥ Sending love to the blockchain-----');
  console.time('Fetch App time');

  try {

    // Metadata information fetching
    const name = await contract.methods.name().call();
    const symbol = await contract.methods.symbol().call();
    const supply = await contract.methods.totalSupply().call();
    
    const events = await contract.getPastEvents('Transfer', {
      fromBlock: 0,
      toBlock: 'latest'
    });
    
    const eventsLength = events.length;
    res.send({name, symbol, supply, eventsLength, events});
 
  } catch (error) {
    console.error(`Error code: ${error.code}. Error message: ${error.message}`); 

    res.send('An error occurred');
    }

  console.log('♥<(˘Ɛ˘) Received love from the blockchain-----');
  console.log('✅ Fetch Standard Query ending.');
	console.timeEnd('Fetch App time');
});

app.listen(port, () => {
  console.log(`Listening on localhost:${port}`);
});


