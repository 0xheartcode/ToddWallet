export interface Erc20KpiModel {
    decimals: string,
    holders: {
        addresses: { address: string, balance: number, supplyPercentage: number }[],
        total: number
    },
    name: string,
    supply: string,
    symbol: string
}