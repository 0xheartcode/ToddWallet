# README.md
---
## Information on this project
This is an overview of the files below. It is a work in progress and will be dynamically updated.

TODO for this project:

- get deployment block information from any contract (where do I find this information)
- get a way to query transactions with multiple RPC providers:
- 	1. Alchemy (WORKS)
- 	2. Llama (Does not work)
- 	3. Webwallet from user.
- Handle the output:
- 	1. write the output manually to a json file
- 	2. write the output to a mongoDB database.
- 	3. upload that mongodb database to github to be able to share it easily.
- Query the json output:
- 	1. Query the json output to find:
- 		1. all current holders.
- 		2. all holders of all time
- 		3. all biggest buyers
- 		4. all biggest sellers
- 		5. wallets with the most transactions.
- 		6. all historical holders (at a specific block)
- 		7. plot historical holders.
-

DONE what has already been done:

-
-
-


### Benchmarks
BENCHMARK STATS, for different contracts:

Contract 1: 2logs
	Fetch App time: 711.907ms


Contract 2: 4379logs
	Fetch App time: 19.401s


Contract 3: 48,236logs


Contract 4: 253,517logs

Contract 5: 82,228logs
	
Contract 6: 158,666,633
	
	
Potential solution:
A.
	Go from 0- 1 000 000 block leaps
	if it crashes:
		find the crashing block and implement:
			2000-2000.

B.
	Find the deployment block.
	Increment from there.



Nodes to use:
alchemy
infura
quicknodes, all restrict blocks and give an indication.
Alternatively, llamarpc with the crash method(A);
Alternatively the persons checking personal rpc metamask and such.



## DASHBOARD
Graphical dashboard inspiration, what the dashboard should look like for v0.
---
|---------|
| ---     |
| ToddWallet v0 BETA |
| CURRENT BLOCKNUMBER: 11110 |
| LAST QUERY BLOCKNUMBER: 11109 |
| TOKEN NAME: TESTERC20 |
| TOKEN TICKER: TST20 |
| HOLDERS: 50 |
| TOP10 HOLDER LIST: |
| NAME | AMOUNT | USD$ | %TOTAL SUPPLY |
| 0x1 | 100000 | 50$  | 3% |
| 0x2 | 20     | 1$   | 0.1% |
| 0x3 |        |      |     |
| ... | ...    | ...  | ... |
| 0x10|        |      |     |
| --> VIEW MORE(complete holder list)[link] |
| TOP10 BUYERS |
| NAME | AMOUNT | USD$ |
| 0x1  |        |      |
| TOP10 SELLERS |
| NAME | AMOUNT | USD$ |
