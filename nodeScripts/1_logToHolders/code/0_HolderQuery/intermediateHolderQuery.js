const fs = require('fs');
const arg = process.argv[2]
// Load the JSON file
const jsonData = fs.readFileSync(arg, 'utf8');
const data = JSON.parse(jsonData);

// Create a dictionary to hold the balances of each account

const totalSupply = BigInt(data.supply);
const decimals = data.decimals;
const name = data.name;
const eventsLength = data.eventsLength;
const supplyFloat = parseFloat(totalSupply.toString()) / (10 ** decimals);

const balances = {};

// Iterate through the events and update the balances
for (const event of data.events) {
  const from = event.returnValues.from;
  const to = event.returnValues.to;
  const value = BigInt(event.returnValues.value);

  // Subtract the value from the sender's balance
  if (balances[from]) {
    balances[from].balance -= parseInt(value);
    balances[from].txCount += 1;
    balances[from].txSent += 1;
    if (from === '0xF6C8A1aB19924f92EF671Cf1288f47ef10A000E5') {
      if (balances[to]) {
        balances[to].txBuy += 1;
        balances[to].txCount +=1;
        balances[to].txReceived +=1;
      } else {
        balances[to] = { balance: 0, txCount: 1, txSent: 0, txReceived: 1, txBuy: 1, txSell: 0 };
      }
    }
  } else {
    balances[from] = {balance: -parseInt(value), txCount: 1, txSent: 0, txReceived: 0, txBuy: 0, txSell: 0};
    if (from === '0xF6C8A1aB19924f92EF671Cf1288f47ef10A000E5') {
      if (balances[to]) {
        balances[to].txBuy = balances[to]?.txBuy ?? 0 + 1;
        //  balances[to].txBuy = 1;
      } else {
        balances[to]  = { balance: 0, txCount: 1, txSent: 0, txReceived: 1, txBuy: 1, txSell: 0 };
      }   
    }
  }

  // Add the value to the receiver's balance
  if (balances[to]) {
    balances[to].balance += parseInt(value);
    //balances[to].txCount += 1;
    //balances[to].txReceived += 1;
    if (from != '0xF6C8A1aB19924f92EF671Cf1288f47ef10A000E5') {
      balances[to].txCount += 1;
      balances[to].txReceived +=1;
      // balances[to].txCount = 0;
    } else {
      
    }

    if (to === '0xF6C8A1aB19924f92EF671Cf1288f47ef10A000E5') {
      if (balances[from]) {
        balances[from].txSell +=1; 
      } else {
        balances[from] = { balance: 0, txCount: 1, txSent: 1, txReceived: 0, txBuy: 0, txSell: 1 };
      }
    }
  } else {
    balances[to] = {balance: parseInt(value), txCount: 1, txSent: 0, txReceived: 1, txBuy: 0, txSell: 0};
    if (to === '0xF6C8A1aB19924f92EF671Cf1288f47ef10A000E5') {
      if (balances[from]) {
        balances[from].txSell = balances[from]?.txSell ?? 0 + 1;
        // balances[from].txSell = 1;
      } else {
        balances[from]  = { balance: 0, txCount: 1, txSent: 1, txReceived: 0, txBuy: 0, txSell: 1 };
      }
    }
  }
}


// Get the list of all the holders and their balances
const holders = Object.entries(balances)
  .filter(([_, data]) => data.balance > 0)
  .map(([account, data]) => ({account: account, balance: data.balance, txCount: data.txCount, txSent: data.txSent, txReceived: data.txReceived, txBuy: data.txBuy, txSell: data.txSell}));

holders.forEach((holder) => {
  const balance = holder.balance / 10 ** decimals;
  holder.balance = balance;
  holder.percentage = (balance / supplyFloat*100).toFixed(4);

  //holder.percentageString = `${percentage}%`;


});


holders.sort((a, b) => {
  if (a.balance < b.balance) return 1;
  if (a.balance > b.balance) return -1;
  return 0;
}); // weird looking function because sometimes I use big int.

const numHolders = holders.length;
console.log(holders.slice(0,10));

//console.log(holders);

console.log(`Token decimals: \t ${decimals}`);
console.log(`Token name: \t\t ${name}`);
console.log(`Token events: \t\t ${eventsLength} tx`)
console.log(`Token absolute supply: \t ${totalSupply}`);
console.log(`Token actual supply: \t ${supplyFloat}`);
console.log(`Total amount of holders: ${numHolders}`);
