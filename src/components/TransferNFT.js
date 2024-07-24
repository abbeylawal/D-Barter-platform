import React, { useState } from 'react';
import PhygitalNFT from '../abis/PhygitalNFT.json';

const TransferNFT = ({ web3, account }) => {
  const [to, setTo] = useState('');
  const [tokenId, setTokenId] = useState('');

  const transferNFT = async (e) => {
    e.preventDefault();
    const networkId = await web3.eth.net.getId();
    const nftContract = new web3.eth.Contract(PhygitalNFT.abi, PhygitalNFT.networks[networkId].address);
    await nftContract.methods.transferNFT(account, to, tokenId).send({ from: account });
  };

  return (
    <div>
      <h2>Transfer NFT</h2>
      <form onSubmit={transferNFT}>
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="Recipient Address"
        />
        <input
          type="text"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          placeholder="Token ID"
        />
        <button type="submit">Transfer</button>
      </form>
    </div>
  );
};

export default TransferNFT;
