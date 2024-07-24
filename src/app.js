import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import CreateNFT from './components/CreateNFT';
import TransferNFT from './components/TransferNFT';
import NewAgreement from './components/NewAgreement';
import Withdraw from './components/Withdraw';
import Refund from './components/Refund';
import './App.css';

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(window.web3);
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        setWeb3(window.web3);
      } else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    };

    const loadBlockchainData = async () => {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    };

    loadWeb3();
    loadBlockchainData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Decentralized Barter Exchange</h1>
        <p>Your Account: {account}</p>
      </header>
      <main>
        <CreateNFT web3={web3} account={account} />
        <TransferNFT web3={web3} account={account} />
        <NewAgreement web3={web3} account={account} />
        <Withdraw web3={web3} account={account} />
        <Refund web3={web3} account={account} />
      </main>
    </div>
  );
}

export default App;
