import React, {useEffect, useState} from 'react';
import {TableColumn} from "react-data-table-component";
import Web3 from "web3";
import {AbiItem} from "web3-utils";
import ABI from "../utils/Erc20Abi.json"
import axios from "axios";
import * as yup from "yup";
import {Form, Formik} from "formik";
import {toast} from "react-toastify";
import {Erc20KpiModel} from "../models";

function Home() {
    const web3WithRPCNodeProvider = new Web3(`https://eth-mainnet.g.alchemy.com/v2/Zasjgm-5N8vRTcHsF4HfKcYcCpx0-kp4`)

    const contract = new web3WithRPCNodeProvider.eth.Contract(ABI as AbiItem[], "0x95B58Fa8aC7DBB1511735A5F255aAE8B8c271df7")
    const [result, setResult] = useState<{ data: Erc20KpiModel | null, loading: boolean }>({data: null, loading: false})
    const columns: TableColumn<any>[] = [
        {name: '#', selector: row => row.transactionHash},
        {name: 'Block', selector: row => row.blockNumber, maxWidth: '50px'},
        {name: 'Transaction index', selector: row => row.transactionIndex, maxWidth: '150px'},
        {name: 'To', selector: row => row.returnValues?.to},
        {name: 'Value in Wei', selector: row => row.returnValues?.value.toString()}
    ]

    const FormSearch = () => {
        const schema = yup.object({
            address: yup.string().required('ERC20 address is required'),
        })
        const initialValues: { address: string } = {address: '0xf2051511B9b121394FA75B8F7d4E7424337af687'}

        return <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={(values, {setStatus, setSubmitting}) => {
                setResult({data: null, loading: false})
                axios.get(`http://localhost:2666/erc20/${values.address}/kpi`).then(r => {
                    setResult({data: r.data, loading: false})
                }).catch(e => {
                    toast.error(e.response.data?.message)
                    setResult({data: null, loading: false})
                }).finally(() => setSubmitting(false))
            }}>
            {formik => {
                const {errors, setFieldValue, status, isSubmitting, values} = formik
                return <Form autoComplete="off">
                    {status && <div className="alert alert-danger" role="alert">{status}</div>}

                    <div className="input-group w-auto">
                        <input type="text" name="name" className="form-control" placeholder={"ERC20 Address"} value={values.address}
                               onChange={e => setFieldValue('address', e.target.value)} autoFocus/>
                        {errors.address && <div className="text-danger">{errors.address}</div>}
                        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                            {!isSubmitting && "Search"}
                            {isSubmitting && <span>
                                Creating <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">...</span>
                            </div>
                            </span>}
                        </button>
                    </div>
                </Form>
            }}

        </Formik>
    }


    return <>
        <div className={"d-flex justify-content-center"}>
            <div className="col-xxl-5 col-xl-6 col-lg-6 col-md-8 col-sm-12">
                <FormSearch/>
            </div>
        </div>

        {result.loading && <div className={"text-center"}>Data is loading ...</div>}
        {!result.loading && result.data && <>
            <p>Name: {result.data.name}</p>
            <p>Symbol: {result.data.symbol}</p>
            <p>Supply: {result.data.supply}</p>
            <p>Holders: {result.data.holders.total}</p>

            <table>
                <thead>
                <tr>
                    <th>Address</th>
                    <th>Balance</th>
                    <th>%</th>
                </tr>
                </thead>
                <tbody>
                {result.data.holders.addresses.map(item => (
                    <tr>
                        <td>{item.address}</td>
                        <td>{item.balance}</td>
                        <td>{item.supplyPercentage}%</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>}
    </>
}

export default Home;
