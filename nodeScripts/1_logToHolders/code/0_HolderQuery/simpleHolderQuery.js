const fs = require('fs');
const arg = process.argv[2];
// Load the JSON file
const jsonData = fs.readFileSync(arg, 'utf8');
const data = JSON.parse(jsonData);

// Create a dictionary to hold the balances of each account
const balances = {};

// Iterate through the events and update the balances
for (const event of data.events) {
  const from = event.returnValues.from;
  const to = event.returnValues.to;
  const value = event.returnValues.value;

  // Subtract the value from the sender's balance
  if (balances[from]) {
    balances[from] -= parseInt(value);
  } else {
    balances[from] = -parseInt(value);
  }

  // Add the value to the receiver's balance
  if (balances[to]) {
    balances[to] += parseInt(value);
  } else {
    balances[to] = parseInt(value);
  }
}

// Filter out the accounts with a zero balance
const holders = Object.entries(balances)
  .filter(([_, balance]) => balance > 1000000000000000000)
  .map(([account, _]) => account);

// Create a new object with the holders as a property
const outputObj = { holders };
// Convert the object to JSON-formatted string
const outputJson = JSON.stringify(outputObj);

const length = outputJson.length;
// Output the JSON-formatted string
// console.log(outputJson);
console.log(length);

