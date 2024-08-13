import { useState } from 'react';
import axios from 'axios';
import styles from '../styles/TradeForm.module.css';

const TradeForm = ({ nfts }) => {
  const [nftId, setNftId] = useState('');
  const [counterparty, setCounterparty] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/trades', {
        nftId,
        counterparty
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <select value={nftId} onChange={(e) => setNftId(e.target.value)}>
        <option value="">Select NFT</option>
        {nfts.map((nft) => (
          <option key={nft.tokenId} value={nft.tokenId}>
            {nft.description}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Counterparty Address"
        value={counterparty}
        onChange={(e) => setCounterparty(e.target.value)}
      />
      <button type="submit">Propose Trade</button>
    </form>
  );
};

export default TradeForm;
