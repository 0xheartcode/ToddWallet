import {Erc20Model, TransferLogModel} from "./models";
import Web3 from "web3";
import ABI from "./artifacts/ABI.json";
import {AbiItem} from "web3-utils";
import {EventData} from "web3-eth-contract";

const web3WithAlchemyProvider = new Web3(`https://eth-mainnet.g.alchemy.com/v2/Zasjgm-5N8vRTcHsF4HfKcYcCpx0-kp4`)


// Sync Transfer logs of an ERC20 with our DB
export async function syncTransferEventLogs(erc20_address: string) {
    // Check address is valid
    if (!Web3.utils.isAddress(erc20_address)) throw new Error(`${erc20_address} is not a valid address`)

    // Checks if erc20 exists in DB
    let erc20_in_db = await Erc20Model.findOne({address: erc20_address})

    const contract = new web3WithAlchemyProvider.eth.Contract(ABI as AbiItem[], erc20_address);
    let events: EventData[] = []; // Events from RPC


    const fromBlock: number = erc20_in_db?.lastQueriedBlock || 0;
    let fromBlockNumber: number = fromBlock;
    let toBlockNumber: number = await web3WithAlchemyProvider.eth.getBlockNumber();

    // Get all logs
    while (fromBlockNumber <= fromBlock) {
        let eventsBatch: EventData[] = [];
        try {
            eventsBatch = await contract.getPastEvents('Transfer', {
                fromBlock: fromBlockNumber,
                toBlock: toBlockNumber
            })
            fromBlockNumber = toBlockNumber + 1;
            toBlockNumber = fromBlock;

        } catch (error: any) {
            const regex = /this block range should work: \[(0x[a-fA-F0-9]+), (0x[a-fA-F0-9]+)]/;
            const match = error.message.match(regex);
            if (match) {
                const newFromBlockNumber = parseInt(match[1]);
                const newToBlockNumber = parseInt(match[2]);
                fromBlockNumber = newFromBlockNumber;
                toBlockNumber = newToBlockNumber;
                continue;
            } else {
                throw new Error("Unexpected Error")
            }
        }

        events = events.concat(eventsBatch);
    }


    // If ERC20 does not exist in our DB
    if (!erc20_in_db) {
        // Create a brand new ERC20
        erc20_in_db = new Erc20Model({
            address: erc20_address,
        })
    }

    // Update lastQueriedBlock (it will be used to fetch events from X block)
    erc20_in_db!.lastQueriedBlock = toBlockNumber
    await erc20_in_db!.save();

    // Format RPC events to Mongoose Model events
    const transferLogs = events.map(item => {
        return new TransferLogModel({
            from: item.returnValues?.from,
            to: item.returnValues?.to,
            transactionHash: item.transactionHash,
            blockNumber: item.blockNumber,
            value: item.returnValues?.value,
            erc20: erc20_in_db
        })
    })

    await TransferLogModel.insertMany(transferLogs);
}

export async function getTokenHolders(erc20_address: string, limit?: number) {
    // Checks if erc20 exists in DB
    let erc20_in_db = await Erc20Model.findOne({address: erc20_address})

    if (!erc20_in_db) throw new Error(`no Erc20 found with address ${erc20_address} in DB`)

    const receivedTokensByAddress: { _id: string, totalReceived: number }[] = await TransferLogModel.aggregate([
        {
            $match: {erc20: {$eq: erc20_in_db!._id}}
        },
        {
            $group: {
                _id: '$to',
                totalReceived: {$sum: {$toDouble: "$value"}},
            },
        }
    ])
    const sentTokensByAddress: { _id: string, totalSent: number }[] = await TransferLogModel.aggregate([
        {
            $match: {erc20: {$eq: erc20_in_db!._id}}
        },
        {
            $group: {
                _id: '$from',
                totalSent: {$sum: {$toDouble: "$value"}},
            },
        }
    ])

    const contract = new web3WithAlchemyProvider.eth.Contract(ABI as AbiItem[], erc20_address);
    const totalSupply = await contract.methods.totalSupply().call();


    // -- Calculate Token balance of each address both aggregation above
    let addressesBalance = receivedTokensByAddress
        .map(item => {
            // Check if the address sent tokens
            let totalSent = sentTokensByAddress.find(item_ => item_._id == item._id)?.totalSent
            if (totalSent) {
                const balance = item.totalReceived - totalSent
                const supplyPercentage = (balance / totalSupply * 100)
                return {address: item._id, balance: balance, supplyPercentage: parseFloat(supplyPercentage.toFixed(2))}
            } else {
                const balance = item.totalReceived
                const supplyPercentage = (balance / totalSupply * 100)
                return {address: item._id, balance: balance, supplyPercentage: parseFloat(supplyPercentage.toFixed(2))}
            }
        })
        .filter(item => item.balance > 0) // Filter address who have tokens
        .sort((a, b) => b.balance - a.balance) // Sort

    const totalHolders = addressesBalance.length
    if (limit) addressesBalance = addressesBalance.slice(0, limit)

    return {
        addresses: addressesBalance,
        total: totalHolders
    }
}

export function jojo(){
    return "I m the best"
}
