const fs = require('fs');
const arg = process.argv[2];
// Load the JSON file
const jsonData = fs.readFileSync(arg, 'utf8');
const data = JSON.parse(jsonData);

// Create a set to hold the unique addresses
const addresses = new Set();

// Iterate through the events and add the "from" and "to" addresses to the set
for (const event of data.events) {
  const from = event.returnValues.from;
  const to = event.returnValues.to;
  addresses.add(from);
  addresses.add(to);
}

// Convert the set to an array and sort it alphabetically
const uniqueAddresses = Array.from(addresses).sort();

const outputJson = JSON.stringify(uniqueAddresses);
const length = outputJson.length;
// Output the unique addresses
console.log(outputJson);
//console.log(length);
