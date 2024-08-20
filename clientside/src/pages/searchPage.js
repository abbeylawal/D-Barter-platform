import React, { useEffect, useContext, useState } from "react";
import Style from "../styles/searchPage.module.css";
import { NFTSlider, Filter, Banner } from "../components/componentsIndex";
import { SearchBar } from "./SearchPage/searchPageIndex";
import { NFTCardTwo } from "../components/componentsIndex";
import { NFTCardMain } from "../components/componentsIndex";
import { NFTCard } from "../components/componentsIndex";
import { Category } from "../components/componentsIndex";
import images from "../assets/img";
// import NFTCardTwo from "../collectionPage/collectionIndex";

// SMART CONTRACT
import { NFTMarketplaceContext } from "../../SmartContract/Context/NFTMarketplaceContext";

const searchPage = () => {
  const { fetchNFTs } = useContext(NFTMarketplaceContext);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);
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
    fetchNFTs()
      .then((item) => {
        if (Array.isArray(item)) {
          setNfts(item.reverse());
          setNftsCopy(item);
        } else {
          console.error("fetchNFTs did not return an array:", item);
          setNfts(cardArray);
          setNftsCopy(cardArray);
        }
      })
      .catch((error) => {
        console.error("Error fetching NFTs:", error);
        setNfts(cardArray);
        setNftsCopy(cardArray);
      });
  }, [fetchNFTs, cardArray]);

  const onHandleSearch = (value) => {
    const filteredNFTs = nfts.filter(({ name }) => {
      name.toLowerCase().includes(value.toLowerCase());
    });

    if (filteredNFTs.length === 0) {
      setNfts(nftsCopy);
    } else {
      setNfts(filteredNFTs);
    }
  };

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
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
      <NFTCard initialCardArray={nfts} />
    </div>
  );
};

export default searchPage;
