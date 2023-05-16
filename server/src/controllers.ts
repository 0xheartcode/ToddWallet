import {Request, Response} from "express";
import {getTokenHolders, syncTransferEventLogs} from "./services";
import Web3 from "web3";
import ABI from "./artifacts/ABI.json";
import {AbiItem} from "web3-utils";

const web3WithAlchemyProvider = new Web3(`https://eth-mainnet.g.alchemy.com/v2/Zasjgm-5N8vRTcHsF4HfKcYcCpx0-kp4`)

export async function getErc20KpiController(req: Request, res: Response) {
    // Get :address from URL
    const erc20_address: string = req.params.address

    // Sync ERC20 Transfer Logs in blockchain with our DB
    try {
        await syncTransferEventLogs(erc20_address)
    } catch (e: any) {
        return res.status(400).json({message: e.message})
    }

    // Prepare KPI
    // -- Get ERC20 & Transfer data from DB
    const holders = await getTokenHolders(erc20_address, 10)

    // -- Get contract name, symbol, supply & decimals
    const contract = new web3WithAlchemyProvider.eth.Contract(ABI as AbiItem[], erc20_address);
    const name = await contract.methods.name().call();
    const symbol = await contract.methods.symbol().call();
    const supply = await contract.methods.totalSupply().call();
    const decimals = await contract.methods.decimals().call();


    return res.json({holders, name, symbol, supply, decimals})
}


