require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    //  ganache test net
    ganache: {
      url: process.env.GANACHE_TESTNET_RPC_URL,
      accounts: [process.env.GANACHE_PRIVATE_KEY]
    },
  },
};
