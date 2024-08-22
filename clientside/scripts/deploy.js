// Importing Hardhat Runtime Environment explicitly
const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");

  // Deploy the contract
  const nftMarketplace = await NFTMarketplace.deploy();

  // Wait for the deployment transaction to be mined
  await nftMarketplace.waitForDeployment();

  console.log("NFTMarketplace deployed to:", await nftMarketplace.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
