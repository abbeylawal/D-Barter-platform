const hre = require("hardhat");

async function main() {

    // const Lock = await hre.ethers.getContractFactory("Lock");
    // const lock = await Lock.deploy();


    const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
    // const unlockTime = Math.floor(Date.now() / 1000) + 60; // Example unlock time (current time + 60 seconds)
    // const nFTMarketplace = await Lock.deploy(unlockTime);

    const nftMarketplace = await NFTMarketplace.deploy();

    await NFTMarketplace.deployed();

    // console.log(
    //  `Lock with ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
    // );

    console.log(`Deployed Contract Address ${nftMarketplace.address}`);
}


main().catch((error) => {
    console.error(error);
    process.exitcode = 1;
});