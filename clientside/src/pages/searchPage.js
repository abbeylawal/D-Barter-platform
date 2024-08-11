import React from "react";
import Style from "../styles/searchPage.module.css";
import { NFTSlider, Filter, Banner } from "../components/componentsIndex";
import { SearchBar } from "./SearchPage/searchPageIndex";
import { NFTCardTwo } from "../components/componentsIndex";
import { NFTCard } from "../components/componentsIndex";
import images from "../assets/img";
// import NFTCardTwo from "../collectionPage/collectionIndex";
const searchPage = () => {
  return (
    <div className={Style.searchPage}>
      <Banner bannerImage={images.creatorbackground2} />
      <SearchBar />
      <Filter />
      <NFTCard />
      <NFTCardTwo />
    </div>
  );
};

export default searchPage;
