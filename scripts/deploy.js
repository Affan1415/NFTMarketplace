const  hre  = require("hardhat");

async function main() {
  try {
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    const nftMarketplace = await NFTMarketplace.deploy();

    console.log("Contract deployed, waiting for confirmation...");

    await nftMarketplace.deployed(); // Ensure contract is deployed
    console.log("NFTMarketplace deployed to:", nftMarketplace.target);

  } catch (error) {
    
    console.error("Error deploying contract:", error);
    if (error.transactionHash) {
      console.error("Transaction hash:", error.transactionHash);
    }
  }


  // const NFTMarketplace = await hre.ethers.deployContract("NFTMarketplace");
  // await NFTMarketplace.waitForDeployment();
  // console.log(NFTMarketplace);
  // console.log('deployed to', NFTMarketplace.target);
}


main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

