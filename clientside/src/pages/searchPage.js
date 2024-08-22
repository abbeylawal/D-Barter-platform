import React, { useEffect, useContext, useState } from "react";
import Style from "../styles/searchPage.module.css";
import {
  NFTSlider,
  Filter,
  Banner,
  Loader,
} from "../components/componentsIndex";
import { SearchBar } from "./SearchPage/searchPageIndex";
import { NFTCardTwo } from "../components/componentsIndex";
import { NFTCardMain } from "../components/componentsIndex";
import { NFTCard } from "../components/componentsIndex";
import { Category } from "../components/componentsIndex";
import images from "../assets/img/";
// import NFTCardTwo from "../collectionPage/collectionIndex";

// SMART CONTRACT
import { NFTMarketplaceContext } from "../../SmartContract/Context/NFTMarketplaceContext";

const searchPage = () => {
  const { fetchNFTs } = useContext(NFTMarketplaceContext);
  const [nfts, setNfts] = useState([]);
  const [filteredNFTs, setFilteredNFTs] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)
  const [cardArray, setCardArray] = useState([
    {
      id: 1,
      image: images.NFT_image_1,
      name: "Clone",
      currentBid: "1.000",
      stock: 51,
      likes: 22,
      remainingTime: "3h: 15m",
      swapCategory: ["Art"],
      liked: false,
    },
    {
      id: 2,
      image: images.NFT_image_3,
      name: "Cosmic Voyager",
      currentBid: "0.875",
      stock: 37,
      likes: 18,
      remainingTime: "5h: 30m",
      swapCategory: ["Fashion"],
      liked: false,
    },
    {
      id: 3,
      image: images.NFT_image_2,
      name: "Digital Dreams",
      currentBid: "1.200",
      stock: 25,
      likes: 30,
      remainingTime: "2h: 45m",
      swapCategory: ["Art", "Fashion", "Gadget"],
      liked: false,
    },
    {
      id: 3,
      image: images.NFT_image_9,
      name: "Digital Dreams",
      currentBid: "1.200",
      stock: 25,
      likes: 30,
      remainingTime: "2h: 45m",
      swapCategory: ["Art", "Fashion", "Gadget"],
      liked: false,
    },
  ]);

  useEffect(() => {
    const fetchAllNFTs = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching NFTs...");
        const fetchedNFTs = await fetchNFTs();
        console.log("Fetched NFTs:", fetchedNFTs);
        setNfts(fetchedNFTs);
        setFilteredNFTs(fetchedNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        setError(
          "Failed to fetch NFTs. Please check the console for more details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllNFTs();
  }, [fetchNFTs]);


  const onHandleSearch = (value) => {
    const filteredNFTs = nfts.filter(({ name }) =>
      name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredNFTs(filteredNFTs);
  };

  const onClearSearch = () => {
    setFilteredNFTs(nfts);
  };

  return (
    <div className={Style.searchPage}>
      <Banner bannerImage={images.creatorbackground2} />
      <Category />
      <SearchBar
        onHandleSearch={onHandleSearch}
        onClearSearch={onClearSearch}
      />
      <Filter />
      {loading ? (
        <Loader />
      ) : filteredNFTs.length > 0 ? (
        <NFTCard initialCardArray={filteredNFTs} />
      ) : (
""
      )}
    </div>
  );
};

export default searchPage;
