import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import TradeForm from '../components/TradeForm';

const Trade = () => {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const response = await axios.get('/api/nfts');
        setNfts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNFTs();
  }, []);

  return (
    <div>
      <Header />
      <h1>Trade NFTs</h1>
      <TradeForm nfts={nfts} />
    </div>
  );
};

export default Trade;
