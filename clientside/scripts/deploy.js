// Importing Hardhat Runtime Environment explicitly
const hre = require("hardhat");

async function main() {
  const HTLC = await hre.ethers.getContractFactory("HTLC");

  // Deploy the HTLC contract
  const htlc = await HTLC.deploy();

  await htlc.waitForDeployment();

  
  // Get the contract factory for NFTMarketplace
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  
  // Deploy the NFTMarketplace contract with the address of the deployed HTLC contract
  const nftMarketplace = await NFTMarketplace.deploy(await htlc.getAddress());
  
  await nftMarketplace.waitForDeployment();
  
  console.log("NFTMarketplace deployed to:", await nftMarketplace.getAddress());
  console.log("HTLC deployed to:", await htlc.getAddress());

  // ----- HTLC SmartContract -----
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
