import React, {useState} from 'react';
import Web3 from "web3";
import axios from "axios";
import * as yup from "yup";
import {Form, useFormik} from "formik";
import {Erc20KpiModel} from "../models";

function Home() {
    const web3WithRPCNodeProvider = new Web3(`https://eth-mainnet.g.alchemy.com/v2/Zasjgm-5N8vRTcHsF4HfKcYcCpx0-kp4`)

    // Get some KPIs of a given ERC20 address
    const Erc20SearchAndKpi = () => {
        const [kpi, setKpi] = useState<Erc20KpiModel>()

        const validationSchema = yup.object({
            address: yup.string().required('address is required'),
        })
        const initialValues: { address: string } = {address: '0xf2051511B9b121394FA75B8F7d4E7424337af687'}

        const formik = useFormik({
            initialValues, validationSchema,
            onSubmit: (values, {setSubmitting, setStatus}) => {
                setStatus(false)
                axios.get(`http://localhost:2666/erc20/${values.address}/kpi`).then(r => {
                    setKpi(r.data)
                }).catch(e => {
                    setStatus(e.response.data?.message || "Something went wrong while getting KPIs")
                }).finally(() => setSubmitting(false))
            },
        });

        const Form = () => {
            return <form autoComplete={"false"} onSubmit={formik.handleSubmit}>
                {formik.status && <div className="alert alert-danger" role="alert">{formik.status}</div>}

                <div className="input-group w-auto">
                    <input type="text" name="name" className="form-control" placeholder={"ERC20 Address"} value={formik.values.address}
                           onChange={e => formik.setFieldValue('address', e.target.value)} autoFocus/>
                    <button className="btn btn-primary" type="submit" disabled={formik.isSubmitting}>
                        {!formik.isSubmitting && "Get KPIs"}
                        {formik.isValid && formik.isSubmitting && <span>
                            Loading <div className="spinner-border spinner-border-sm ms-1" role="status">
                            <span className="visually-hidden">...</span>
                        </div>
                        </span>}
                    </button>
                </div>
                {formik.errors.address && <div className="text-danger">{formik.errors.address}</div>}

            </form>
        }

        const Kpi = ({kpi}: { kpi: Erc20KpiModel }) => {
            return <>
                <div className="card">
                    <div className="card-header">
                        {kpi.name}
                    </div>
                    <div className="card-body">
                        <p>Symbol: {kpi.symbol}</p>
                        <p>Supply: {Web3.utils.fromWei(kpi.supply, 'ether')} ETH</p>
                        <p>Holders: {kpi.holders.total}</p>

                        <table className="table table-sm">
                            <thead>
                            <tr>
                                <th scope="col">Address</th>
                                <th scope="col">Balance</th>
                                <th scope="col">% supply</th>
                            </tr>
                            </thead>
                            <tbody>
                            {kpi.holders.addresses.map(item => {
                                const balance = Number(item.balance).toLocaleString('fullwide', { useGrouping: false })
                                return <tr key={item.address}>
                                    <td>{item.address}</td>
                                    <td>{Web3.utils.fromWei(Web3.utils.toBN(balance), 'ether')}</td>
                                    <td>{item.supplyPercentage}%</td>
                                </tr>
                            })}
                            </tbody>
                        </table>

                    </div>
                </div>
            </>
        }

        console.log(formik.isSubmitting, formik.status)
        return <>
            <div className={"d-flex justify-content-center mb-4"}>
                <div className="col-xxl-5 col-xl-6 col-lg-6 col-md-8 col-sm-12">
                    <Form/>
                </div>
            </div>

            {!formik.isSubmitting && !formik.status && <div className={"d-flex justify-content-center"}>
                <div className="w-75">
                    {kpi && <Kpi kpi={kpi}/>}
                </div>
            </div>}
        </>
    }

    return <>
        <Erc20SearchAndKpi/>
    </>
}

export default Home;
