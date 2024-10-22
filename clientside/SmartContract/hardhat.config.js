// hardhat.config.js

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 50,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    // Ganache Testnet
    ganache: {
      url: process.env.GANACHE_TESTNET_RPC_URL,
      accounts: [process.env.GANACHE_PRIVATE_KEY],
    },
  },
};
