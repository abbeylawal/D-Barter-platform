const PhygitalNFT = artifacts.require("PhygitalNFT");
const HTLC = artifacts.require("HTLC");

module.exports = function (deployer) {
  // Deploy the PhygitalNFT contract
  deployer.deploy(PhygitalNFT).then(() => {
    console.log("PhygitalNFT deployed at address:", PhygitalNFT.address);
  });

  // Deploy the HTLC contract
  deployer.deploy(HTLC).then(() => {
    console.log("HTLC deployed at address:", HTLC.address);
  });
};
