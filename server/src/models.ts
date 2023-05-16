import mongoose from "mongoose";

export interface ITransferLog {
    _id?: string,
    from: string,
    to: string,
    value: string,
    transactionHash: string,
    blockNumber: string,
    erc20: IErc20
}

export interface IErc20 {
    _id?: string,
    address: string,
    lastQueriedBlock: number,
    // transferEvents: ITransferLog[]
}

const Erc20Shema = new mongoose.Schema<IErc20>({
    address: String,
    lastQueriedBlock: Number,
    // transferEvents: [{type: mongoose.Schema.Types.ObjectId, ref: "TransferLog"}]
})
const Erc20Model = mongoose.model('Erc20', Erc20Shema)


const TransferLogSchema = new mongoose.Schema<ITransferLog>({
    from: String,
    to: String,
    value: String,
    transactionHash: String,
    blockNumber: String,
    erc20: {type: mongoose.Schema.Types.ObjectId, ref: "Erc20"}
})
const TransferLogModel = mongoose.model('TransferLog', TransferLogSchema)

export {Erc20Model, TransferLogModel}