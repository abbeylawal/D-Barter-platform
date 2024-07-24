import React, { useState } from 'react';
import PhygitalNFT from '../abis/PhygitalNFT.json';

const CreateNFT = ({ web3, account }) => {
  const [tokenURI, setTokenURI] = useState('');

  const createNFT = async (e) => {
    e.preventDefault();
    const networkId = await web3.eth.net.getId();
    const nftContract = new web3.eth.Contract(PhygitalNFT.abi, PhygitalNFT.networks[networkId].address);
    await nftContract.methods.createNFT(tokenURI).send({ from: account });
  };

  return (
    <div>
      <h2>Create NFT</h2>
      <form onSubmit={createNFT}>
        <input
          type="text"
          value={tokenURI}
          onChange={(e) => setTokenURI(e.target.value)}
          placeholder="Token URI"
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateNFT;
