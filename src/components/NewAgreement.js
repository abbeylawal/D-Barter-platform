import React, { useState } from 'react';
import HTLC from '../abis/HTLC.json';

const NewAgreement = ({ web3, account }) => {
  const [contractId, setContractId] = useState('');
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [hashlock, setHashlock] = useState('');
  const [timelock, setTimelock] = useState('');

  const createAgreement = async (e) => {
    e.preventDefault();
    const networkId = await web3.eth.net.getId();
    const htlcContract = new web3.eth.Contract(HTLC.abi, HTLC.networks[networkId].address);
    await htlcContract.methods.newAgreement(contractId, receiver, web3.utils.toWei(amount, 'ether'), hashlock, timelock).send({ from: account, value: web3.utils.toWei(amount, 'ether') });
  };

  return (
    <div>
      <h2>New HTLC Agreement</h2>
      <form onSubmit={createAgreement}>
        <input
          type="text"
          value={contractId}
          onChange={(e) => setContractId(e.target.value)}
          placeholder="Contract ID"
        />
        <input
          type="text"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          placeholder="Receiver Address"
        />
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (ETH)"
        />
        <input
          type="text"
          value={hashlock}
          onChange={(e) => setHashlock(e.target.value)}
          placeholder="Hashlock"
        />
        <input
          type="text"
          value={timelock}
          onChange={(e) => setTimelock(e.target.value)}
          placeholder="Timelock (seconds)"
        />
        <button type="submit">Create Agreement</button>
      </form>
    </div>
  );
};

export default NewAgreement;
