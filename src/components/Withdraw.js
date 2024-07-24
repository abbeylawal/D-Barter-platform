import React, { useState } from 'react';
import HTLC from '../abis/HTLC.json';

const Withdraw = ({ web3, account }) => {
  const [contractId, setContractId] = useState('');
  const [preimage, setPreimage] = useState('');

  const withdrawFunds = async (e) => {
    e.preventDefault();
    const networkId = await web3.eth.net.getId();
    const htlcContract = new web3.eth.Contract(HTLC.abi, HTLC.networks[networkId].address);
    await htlcContract.methods.withdraw(contractId, preimage).send({ from: account });
  };

  return (
    <div>
      <h2>Withdraw Funds</h2>
      <form onSubmit={withdrawFunds}>
        <input
          type="text"
          value={contractId}
          onChange={(e) => setContractId(e.target.value)}
          placeholder="Contract ID"
        />
        <input
          type="text"
          value={preimage}
          onChange={(e) => setPreimage(e.target.value)}
          placeholder="Preimage"
        />
        <button type="submit">Withdraw</button>
      </form>
    </div>
  );
};

export default Withdraw;
