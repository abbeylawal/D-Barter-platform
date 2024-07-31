const Web3 = require('web3');
require('dotenv').config();

let web3;
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  web3 = new Web3(window.ethereum);
  window.ethereum.request({ method: 'eth_requestAccounts' });
} else {
  const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545'); // Ganache
  web3 = new Web3(provider);
}

module.exports = web3;
