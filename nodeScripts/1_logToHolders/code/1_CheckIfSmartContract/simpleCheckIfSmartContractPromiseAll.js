require('dotenv').config();
const Web3 = require('web3');
const fs = require('fs');
const arg = process.argv[2];

const web3 = new Web3(process.env.NEW_ETH_RPC); // replace with your own Infura endpoint

const holders = JSON.parse(fs.readFileSync(arg)); // load the JSON file
const smartContractList = new Set();
let i = 0;
(async () => {
  const promises = holders.map(async (address) => {
    const code = await web3.eth.getCode(address, 'latest');
    i++;
    if (code !== '0x') {
      smartContractList.add(address);
      console.log(`${i} \t ${address} is a smart contract`);
    } else {
      console.log(`${i} \t ${address} is not a smart contract`);
    }
  });
  await Promise.all(promises);
  const outputJson = JSON.stringify(smartContractList);
  console.log(outputJson);
})();

