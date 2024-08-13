import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import NFTCard from '../components/NFTCard';

const Marketplace = () => {
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
      <h1>NFT Marketplace</h1>
      <div>
        {nfts.map((nft) => (
          <NFTCard key={nft.tokenId} nft={nft} />
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
