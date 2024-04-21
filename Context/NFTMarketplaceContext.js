import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { useRouter } from 'next/router';
import { NFTMarketplaceAddress, NFTMarketplaceABI } from './Constants';
import { create as ipfsHttpClient } from 'ipfs-http-client';
//import axios from "axios";
import { Web3Provider } from '@ethersproject/providers';
// const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");
//const ethers = require('ethers');
const axios = require('axios');
const projectId = "f155e59a3c174a3f901a6475b14bb7e0"
const projectSecretKey = "fBHPfzAGceGi8D1j4HVOOo0qQOxGM33yxPC0e7f3PGfGmA6HMVbt1A"
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecretKey}`).toString("base64")}`;

const client = ipfsHttpClient(
    {
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
        headers: {
            authorization: auth,
        }
    }
)

const subdomain = "mainnet"

const fetchContract = async (signer) => {
    return new ethers.Contract(NFTMarketplaceAddress, NFTMarketplaceABI, signer);
};

const connectingWithSmartContract = async () => {
    try {
        // Initialize Web3Modal instance
        const web3Modal = new Web3Modal({
            network: "localhost", // Specify the network your provider connects to
            cacheProvider: true, // Enable caching to remember the user's choice of provider
        });

        // Connect to a provider using Web3Modal
        const provider = await web3Modal.connect();

        // Check if provider is available
        if (provider && provider.on) {
            console.log('Connected to provider:', provider);

            // Create a Web3Provider instance using the connected provider
            const ethersProvider = new Web3Provider(provider);

            // Request access to user accounts (wallet) using provider
            await provider.request({ method: 'eth_requestAccounts' });

            // Get the signer (account) from the provider
            const signer = ethersProvider.getSigner();

            // Instantiate your smart contract using the signer
            const contract = await fetchContract(signer);

            console.log('Smart contract connected:', contract);
            return contract;
        } else {
            throw new Error('Provider not available');
        }
    } catch (error) {
        console.error('Error connecting to smart contract:', error.message);
        throw error;
    }
};
//internal import
export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvider = (({ children }) => {
    const titleData = "Discover, collect and sell Nfts";

    const checkcontract = async () => {
        const contract = await connectingWithSmartContract();
        console.log(contract)
    }
    const [currentAccount, setCurrentAccount] = useState("");
    const router = useRouter();
    //Check if wallet is empty
    const checkIfWalletConnected = async () => {
        try {
            if (!window.ethereum) return console.log("Install meta mask");

            const accounts = await window.ethereum.request({ method: "eth_accounts" });

            console.log("Wallet connected:", accounts[0]);
            setCurrentAccount(accounts[0])
            if (accounts.length > 0) {
            } else {
                console.log("no account found");
            }
            console.log(currentAccount)
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
                method: "eth_requestAccounts"
            });

            setCurrentAccount(accounts[0]);
            window.location.reload();

        } catch (error) {
            console.log("error while connecting to wallet", error);
        }
    }

    // upload ipfs

    const uploadToIpfs = async (file) => {
        if (file) {
            try {
                const formData = new FormData();
                formData.append("file", file);

                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                        pinata_api_key: `a9c8a527338045f62636`,
                        pinata_secret_api_key: `a6b865561109b28539a77b72959a7baa012e0c256282bd5447abcebe60a9c406`,
                        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyZjhhYjBlZi1lOWVmLTRiNDUtODJmOC0zMTFiMmY5MDczZTAiLCJlbWFpbCI6ImFmZmFuemFoaXIyNkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYTljOGE1MjczMzgwNDVmNjI2MzYiLCJzY29wZWRLZXlTZWNyZXQiOiJhNmI4NjU1NjExMDliMjg1MzlhNzdiNzI5NTlhN2JhYTAxMmUwYzI1NjI4MmJkNTQ0N2FiY2ViZTYwYTljNDA2IiwiaWF0IjoxNzEzNjA2ODAwfQ.u9AWzhnHvz_DJRUSTWfCGYhEGCxDn0Cmv0iE3KQO2RM`,
                        "Content-Type": "multipart/form-data",
                    }
                });

                const imgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
                console.log("IPFS Hash:", imgHash);

                // Perform additional operations with the IPFS hash (e.g., store it, use it in a smart contract, etc.)
                // Example: signer.add(account, imgHash);

                return imgHash; // Return the IPFS hash for further use
            } catch (error) {
                console.error("Error uploading image to Pinata:", error.response.data); // Log the detailed error response
                throw new Error("Unable to upload image to Pinata"); // Throw an error to handle failures
            }

        } else {
            throw new Error("No file provided for upload"); // Throw an error if no file is provided
        }
    };



    const createNFT = async (name, price, image, description, router) => {
        if (!name || !description || !price || !image) {
            setError("Data Is Missing");
            setOpenError(true);
            return; // Added return statement to exit the function if data is missing
        }

        const data = JSON.stringify({ name, description, image });
        console.log(data)
        try {
            const response = await axios({
                method: "POST",
                url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                data: data,
                headers: {
                    pinata_api_key: `a9c8a527338045f62636`,
                    pinata_secret_api_key: `a6b865561109b28539a77b72959a7baa012e0c256282bd5447abcebe60a9c406`,
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyZjhhYjBlZi1lOWVmLTRiNDUtODJmOC0zMTFiMmY5MDczZTAiLCJlbWFpbCI6ImFmZmFuemFoaXIyNkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYTljOGE1MjczMzgwNDVmNjI2MzYiLCJzY29wZWRLZXlTZWNyZXQiOiJhNmI4NjU1NjExMDliMjg1MzlhNzdiNzI5NTlhN2JhYTAxMmUwYzI1NjI4MmJkNTQ0N2FiY2ViZTYwYTljNDA2IiwiaWF0IjoxNzEzNjA2ODAwfQ.u9AWzhnHvz_DJRUSTWfCGYhEGCxDn0Cmv0iE3KQO2RM`,
                    "Content-Type": "application/json",
                }
            });

            const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
            console.log(url);
            console.log("starting to create sale")
            await createSale(url, price, 0, 12);
            console.log("sale created")
            router.push("/searchPage");
        } catch (error) {
            console.error("Error while creating sale2003:", error);
            // Handle the error appropriately, such as displaying an error message to the user
            throw new Error("Unable to create sale");
        }
    };


    const createSale = async (url, formInputPrice, isReselling, id) => {
        try {

            const price = ethers.parseEther(formInputPrice, "ether");
            //const price = ethers.formatEther(formInputPrice.toString());
            // const price = BigInt(pric); 
            console.log(price)
            const contract = await connectingWithSmartContract(); // Assuming connectingWithSmartContract() is a valid function
            console.log(contract)
            console.log(contract.getListingPrice())
            const listingPrice = await contract.getListingPrice();
            console.log(listingPrice);

            let transaction;
            isReselling = 0;
            console.log("815")
            if (!isReselling) {
                transaction = await contract.createToken(url, price, {
                    value: listingPrice.toString(),
                });
                console.log("822")
            }
            else {
                transaction = await contract.reSellToken(url, price, {
                    value: listingPrice.toString(),
                });
                console.log("828")
            }

            await transaction.wait();
            console.log("832")
            router.push('/searchPage');
        } catch (error) {
            console.error("Error while creating sale:", error);
            // Handle the error appropriately, such as displaying an error message to the user
            throw new Error("Unable to create sale"); // Throw an error for further handling if needed
        }
    };

    // const createSale = async (url, formInputPrice, isReselling, id) => {
    //     console.log("entering create sale");
    //     try {
    //         console.log("entering try block");


    //         // Check if MetaMask or another Ethereum provider is available
    //         if (!window.ethereum) {
    //             throw new Error("MetaMask or an Ethereum provider is not available");
    //         }

    //         const provider = new ethers.providers.Web3Provider(window.ethereum);
    //         console.log("the provider is");
    //         console.log(provider);
    //         const signer = provider.getSigner();
    //         console.log("signer");
    //         console.log(signer);


    //         // Request access to user accounts (wallet) using MetaMask
    //         await provider.send("eth_requestAccounts", []);
    //         console.log("854");
    //         const price = ethers.utils.parseUnits(formInputPrice, "ether");
    //         console.log("856");
    //         const contract = await connectingWithSmartContract(); // Assuming connectingWithSmartContract() is a valid function
    //         console.log("858");
    //         const listingPrice = await contract.getListingPrice();
    //         console.log("860");
    //         let transaction;
    //         if (!isReselling) {
    //             transaction = await contract.connect(signer).createToken(url, price, {
    //                 value: listingPrice.toString(),
    //             });

    //         } else {
    //             transaction = await contract.connect(signer).reSellToken(url, price, {
    //                 value: listingPrice.toString(),
    //             });
    //         }
    //         console.log("872");

    //         await transaction.wait();
    //         console.log("Sale created successfully");
    //         router.push('/searchPage');
    //     } catch (error) {
    //         console.error("Error while creating sale:", error);
    //         // Handle the error appropriately, such as displaying an error message to the user
    //         throw new Error("Unable to create sale"); // Throw an error for further handling if needed
    //     }
    // };


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
    };
    useEffect(() => {
        fetchMyNFTsOrListedNFTs();
    }, []);

    const fetchMyNFTsOrListedNFTs = async (type) => {
        try {
            const contract = await connectingWithSmartContract();
            const data = type == "fetchItemsListed"
                ? await contract.fetchItemsListed()
                : await contract.fetchMyNFTs();

            const items = await Promise.all(
                data.map(async ({ tokenId, seller, owner, price: unformatedPrice }) => {
                    const tokenURI = await contract.tokenURI(tokenId);
                    const {
                        data: { image, name, description },
                    } = await axios.get(tokenURI)
                    const price = ethers.utils.formatUnits(
                        unformatedPrice.tostring(),
                        "ethers"
                    );
                    return {
                        price,
                        tokenId: tokenId.toNumber(),
                        seller,
                        owner,
                        image,
                        name,
                        description,
                        tokenURI,
                    };
                })
            )
            return items;
        } catch (error) {
            console.log("error while fetching listed NFTs");
        }
    }

    const buyNFT = async (nft) => {
        try {
            const contract = await connectingWithSmartContract();
            const price = ethers.utils.parseUnits(nft.price.toString(), "ethers")

            const transaction = await contract.createMarketSale(nft.tokenId, {
                value: price,
            });
            await transaction.wait();
        } catch (error) {
            console.log("error buying nft")
        }
    }
    return (
        <NFTMarketplaceContext.Provider value={{
            checkcontract,
            connectWallet,
            checkIfWalletConnected,
            uploadToIpfs,
            createNFT,
            fetchNFT,
            fetchMyNFTsOrListedNFTs,
            createSale,
            buyNFT,
            currentAccount,
            titleData
        }}
        >
            {children}
        </NFTMarketplaceContext.Provider>
    )
})
