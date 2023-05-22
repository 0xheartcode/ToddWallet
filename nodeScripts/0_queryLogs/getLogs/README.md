# getLogs

### Status:
Partly works, needs to be refined for better performance.

### Files:
- [alchemyBruteForceQuery.js](./alchemyBruteForceQuery.js) is a brute forcing algo that uses the custom rpc feature of alchemy to go from 0 to `latest` block. If this does not work, it will go from `0` to the first error (grep from this RPCs custom error). Then it will go from the first error to the latest block. If this does not work it will go from first error +1 to 2nd error. And so on. This works ✅
- [deployRangeQuery.js](./deployRangeQuery.js) this is a mix between `rpcRangeQuery.js` and the search of the first deployment block. Work in progress.
- utils:
- 	[rpcRangeQuery.js](./utils/rpcRangeQuery.js) is a blueprint for the ranged query with an address. It also takes a batchSize as a second argument. It does work usually, if it doesn't reduce/adapt the batchsize. 🟠
- 	[rpcStandardQuery.js](./utils/rpcStandardQuery.js) is a blueprint for the standard query without batch search. It does fail on tokens that have a lot of logs. 🟠
- 
