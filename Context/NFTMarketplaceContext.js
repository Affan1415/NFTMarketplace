import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
//import { NFTMarketplaceAddress, NFTMarketplaceABI } from './Constants';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import axios from "axios";
import { Web3Provider } from '@ethersproject/providers';
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");



const NFTMarketplaceAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Update with your contract address
const NFTMarketplaceABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "approved",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "ApprovalForAll",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_fromTokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_toTokenId",
                "type": "uint256"
            }
        ],
        "name": "BatchMetadataUpdate",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "seller",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "sold",
                "type": "bool"
            }
        ],
        "name": "MarketItemCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "MetadataUpdate",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "createMarketSale",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "tokenURI",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "createToken",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "fetchItemsListed",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "sold",
                        "type": "bool"
                    }
                ],
                "internalType": "struct NFTMarketplace.MarketItem[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "fetchMarketItems",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "sold",
                        "type": "bool"
                    }
                ],
                "internalType": "struct NFTMarketplace.MarketItem[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "fetchMyNFTs",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "sold",
                        "type": "bool"
                    }
                ],
                "internalType": "struct NFTMarketplace.MarketItem[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getApproved",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getListingPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "isApprovedForAll",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "resellToken",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_listingPrice",
                "type": "uint256"
            }
        ],
        "name": "updateListingPrice",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }];

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

//Mahreenimport { NFTMarketplaceAddress, NFTMarketplaceABI } from './Constants';
//fetch contract
// const fetchContract = async (signer) => {
//     return new ethers.Contract(NFTMarketplaceAddress, NFTMarketplaceABI, signer);
// };

// const connectingWithSmartContract = async () => {
//     try {
//         const web3Modal = new Web3Modal();
//         const provider = await web3Modal.connect();

//         console.log("window.ethereum",window.ethereum)
//         if (provider && window.ethereum) {
//             console.log('Connected to provider:', provider);

//             // Create a Web3Provider instance using the Ethereum provider object
//             const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);

//             // Request access to user accounts (wallet) using eth_requestAccounts
//             await ethersProvider.send('eth_requestAccounts', []);

//             // Get the signer (account) from the provider
//             const signer = ethersProvider.getSigner();

//             // Instantiate your smart contract using the signer
//             const contract = await fetchContract(signer);

//             console.log('Smart contract connected:', contract);
//             return contract;
//         } else {
//             throw new Error('Provider not available');
//         }
//     } catch (error) {
//         console.error('Error connecting to smart contract:', error.message);
//         throw error;
//     }
// };

// const fetchContract = async (signerOrProvider) =>
//     new ethers.Contract(
//         NFTMarketplaceAddress,
//         NFTMarketplaceABI,
//         signerOrProvider
//     );

// const connectingWithSmartContract = async () => {
//     try {
//         const web3Modal = new Web3Modal()
//         console.log('1')
//         const connection = await web3Modal.connect()
//         console.log("connection", connection);
//         const provider = new ethers.providers.Web3Provider(connection);
//         await window.ethereum.enable();
//         // const provider = new ethers.providers.Web3Provider(window.ethereum);
//         //const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545'); // Replace with your actual provider URL

//         console.log("provider")
//         console.log(provider)


//         const signer = await provider.getSigner();
//         const contract = await fetchContract(signer)
//         console.log(contract)
//         return contract;

//     } catch (error) {
//         console.log(error);
//         console.log("something went wrong while connecting to smart contract")
//     }
// }



export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvider = (({ children }) => {
    const titleData = "Discover, collect and sell Nfts";

    const checkcontract = async () => {
        const contract = await connectingWithSmartContract();
        console.log(contract)
    }

    const [currentAccount, setCurrentAccount] = useState("");

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
            buyNFT,
            currentAccount,
            titleData
        }}
        >
            {children}
        </NFTMarketplaceContext.Provider>
    )
})