const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledHTLC = require('./build/HTLC.json');
const compiledNFT = require('./build/NFT.json');
require('dotenv').config();

const provider = new HDWalletProvider(
    process.env.MNEMONIC,
    `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Deploying contracts from account', accounts[0]);

    const htlc = await new web3.eth.Contract(compiledHTLC.abi)
        .deploy({ data: compiledHTLC.evm.bytecode.object })
        .send({ from: accounts[0], gas: '3000000' });

    const nft = await new web3.eth.Contract(compiledNFT.abi)
        .deploy({ data: compiledNFT.evm.bytecode.object })
        .send({ from: accounts[0], gas: '3000000' });

    console.log('HTLC deployed to', htlc.options.address);
    console.log('NFT deployed to', nft.options.address);
};

deploy();
