import React, { useEffect, useContext, useState } from "react";
import Style from "../styles/searchPage.module.css";
import {
  NFTSlider,
  Filter,
  Banner,
  Loader,
} from "../components/componentsIndex";
import { SearchBar } from "./SearchPage/searchPageIndex";
import { NFTCard } from "../components/componentsIndex";
import { Category } from "../components/componentsIndex";
import images from "../assets/img/";

// SMART CONTRACT
import { NFTMarketplaceContext } from "../../SmartContract/Context/NFTMarketplaceContext";

const SearchPage = () => {
  const { fetchNFTs } = useContext(NFTMarketplaceContext);
  const [nfts, setNfts] = useState([]);
  const [filteredNFTs, setFilteredNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchAllNFTs = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedNFTs = await fetchNFTs();
        setNfts(fetchedNFTs);
        setFilteredNFTs(fetchedNFTs);
      } catch (error) {
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
    const searchQuery = value.trim().toLowerCase();

    if (searchQuery === "") {
      setFilteredNFTs(nfts);
    } else {
      const filtered = nfts.filter(({ name }) =>
        name.toLowerCase().includes(searchQuery)
      );
      setFilteredNFTs(filtered);
    }
  };

  const onClearSearch = () => {
    setFilteredNFTs(nfts);
  };

  return (
    <div className={Style.searchPage}>
      <Banner bannerImage={images.creatorbackground3} />
      <Category onCategoryChange={setActiveCategory} />
      <SearchBar
        onHandleSearch={onHandleSearch}
        onClearSearch={onClearSearch}
      />
      <Filter onCategoryChange={setActiveCategory} />
      {loading ? (
        <Loader />
      ) : error ? (
        <div className={Style.error}>{error}</div>
      ) : (
        <NFTCard
          initialCardArray={filteredNFTs}
          activeCategory={activeCategory}
        />
      )}
    </div>
  );
};

export default SearchPage;
