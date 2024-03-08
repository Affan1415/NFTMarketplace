import React, { useState, useEffect, useContext } from 'react';
import Wenb3Modal from "web3modal";
const { Web3Modal } = require("web3modal");
import { ethers } from 'ethers';
import Router from 'next/router';
import axios from "axios";

import { create as ipfsHttpClient } from 'ipfs-http-client';

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

//internal import

import { NFTMarketplaceAddress, NFTMarketplaceABI } from './Constants';
import { experimentalAddHardhatNetworkMessageTraceHook } from 'hardhat/config';


//fetch contract

const fetchContract = async (signerOrProvider) =>
    new ethers.Contract(
        NFTMarketplaceAddress,
        NFTMarketplaceABI,
        signerOrProvider
    );

//connecting with smart contract

const connectingWithSmartContract = async () => {
    try {
        // const web3Modal = new Wenb3Modal()
        // const connection = await web3Modal.connect()
        // console.log(connection);
        //const provider = new ethers.providers.Web3Provider(connection);
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        console.log(provider);
        const signer = await provider.getSigner();
        const contract = await fetchContract(signer)
        return contract;

    } catch (error) {
        console.log(error);
        console.log("something went wrong while connecting to smart contract")
    }
}


export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvider = (({ children }) => {
    const titleData = "Discover, collect and sell Nfts";

    const [currentAccount, setCurrentAccount] = useState("");

    //Check if wallet is empty 

    const checkIfWalletConnected = async () => {
        try {
            if (!window.ethereum) return console.log("Install meta mask");

            const accounts = await window.ethereum.request({ method: "eth_accounts" });

            if (accounts.length) {
                setCurrentAccount(accounts[0])
            } else {
                console.log("no account found");
            }
        } catch (error) {
            console.log("something went wrong while connecting to wallet".error);
        }
    }

    useEffect(() => {
        checkIfWalletConnected();

    }, [])

    const connectWallet = async () => {
        try {
            if (!window.ethereum) return console.log("Install meta mask");

            const accounts = await window.ethereum.request({
                method: "eth_requestAccount"
            });

            setCurrentAccount(accounts[0]);
            window.location.reload();

        } catch (error) {
            console.log("error while connecting to wallet", error);
        }
    }

    // upload ipfs
    const uploadToIpfs = async (file) => {
        try {
            const added = await client.add({ content: "file" });
            const url = await `https://ipfs.infura.io/ipfs/${added.path}`;
            return url;
        } catch (error) {
            console.log("error uploading to ipfs", error);
        }
    }

    const createNFT = async (formInput, fileUrl, router) => {

        const { name, description, price } = formInput;
        if (!name || !description || !price || !fileUrl)
            return console.log("Data is Missing");

        const data = JSON.stringify({ name, description, image: fileUrl });

        try {
            const added = await client.add(data);
            const url = `https://ipfs.ifura.io/ipfs/${added.path}`;
            await creatSale(url, price);
        } catch (error) {
            console.log(error);
        }

    }

    const creatSale = async (url, formInputPrice, isReselling, id) => {
        try {
            const price = ethers.utils.parseUnits(formInputPrice, "ethers");
            const contract = await connectingWithSmartContract();

            const listingprice = await contract.getListingPrice();

            const transaction = !isReselling ? await creatToken(url, price, {
                value: listingprice.toString()
            }) : await contract.reSellToken(url, price, {
                value: listingprice.toString(),
            })

            await transaction.wait();
        } catch (error) {
            console.log("error while creating sale");
        }
    }

    const fetchNFT = async () => {
        try {
            const provider = new ethers.providers.JsonRpcProvider();
            const contract = fetchContract(provider);

            const data = await contract.fetchMarketItem();

            console.log(data);

            const items = await Promise.all(
                data.map(async ({ tokenId, seller, owner, price: unformatedPrice }) => {
                    const tokenURI = await contract.tokenURI(tokenId);
                    const {
                        data: { image, name, description },
                    } = await axios.get(tokenURI);

                    const price = ethers.utils.formatUnits(
                        unformatedPrice.toString(), "ether"
                    );
                    return {
                        price,
                        tokenId: tokenId.toNumber(),
                        seller,
                        owner,
                        image,
                        name,
                        description,
                        tokenURI

                    }
                })


            )
            return items;
        } catch (error) {
            console.log("error while fetching NFTs", error);
        }
    }

    const fetchMyNFTsOrListedNFTs = async(type) => {
        try {
            const contract = await connectingWithSmartContract();
            const data = type == "fetchItemsListed" 
            ? await contract.fetchItemsListed()
            : await contract.fetchMyNFTs();

            const items = await promise
        } catch (error) {
            console.log("error while fetching listed NFTs");
        }
    }
    return (
        <NFTMarketplaceContext.Provider value={{
            connectWallet,
            uploadToIpfs,
            createNFT,
            fetchNFT,
            titleData
        }}
        >
            {children}
        </NFTMarketplaceContext.Provider>
    )
})