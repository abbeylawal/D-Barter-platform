const NFTContract = artifacts.require("NFTContract");
const TradeContract = artifacts.require("TradeContract");

/**
 * This function deploys the TradeContract smart contract using Truffle's deployer.
 *
 * @param {TruffleDeployer} deployer - An instance of TruffleDeployer, which provides methods for deploying contracts.
 *
 * @returns {Promise} - A promise that resolves when the deployment is complete.
 */


module.exports = function (deployer) {
  deployer.deploy(NFTContract);
  deployer.deploy(TradeContract);
};
