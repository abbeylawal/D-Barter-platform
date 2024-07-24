import React, { useState } from 'react';
import HTLC from '../abis/HTLC.json';

const Refund = ({ web3, account }) => {
  const [contractId, setContractId] = useState('');

  const refundFunds = async (e) => {
    e.preventDefault();
    const networkId = await web3.eth.net.getId();
    const htlcContract = new web3.eth.Contract(HTLC.abi, HTLC.networks[networkId].address);
    await htlcContract.methods.refund(contractId).send({ from: account });
  };

  return (
    <div>
      <h2>Refund Funds</h2>
      <form onSubmit={refundFunds}>
        <input
          type="text"
          value={contractId}
          onChange={(e) => setContractId(e.target.value)}
          placeholder="Contract ID"
        />
        <button type="submit">Refund</button>
      </form>
    </div>
  );
};

export default Refund;
