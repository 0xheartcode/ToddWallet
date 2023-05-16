import {Button, Container, Modal, Navbar} from "react-bootstrap";
import Web3 from "web3";
import React, {useState} from "react";
import * as yup from "yup"
import {Form, Formik} from "formik";
import axios from "axios";

export default function Header() {
    const web3WithRPCNodeProvider = new Web3(`${process.env.REACT_APP_WSS_ALCHEMY_ENDPOINT}`)
    const [isModalFormSearchOpen, setIsModalFormSearchOpen] = useState<boolean>(false)


    return <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
            <Navbar.Brand>Todd wallet</Navbar.Brand>
        </Container>
    </Navbar>
}