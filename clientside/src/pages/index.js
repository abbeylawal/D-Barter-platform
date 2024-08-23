import React, {
  useState,
  useContext,
  useEffect
} from "react";
import Header from '../components/Header';
import Style from "../styles/Index.module.css";
import {
  MainSection,
  NFTSlider,
  Title,
  Category,
  Filter,
  Collection,
  NFTCard,

} from '../components/componentsIndex';
import nftData from "../assets/Data/nftData.json"
import { NFTMarketplaceContext } from "../../SmartContract/Context/NFTMarketplaceContext";



const Home = () => {
  const { checkWalletConnection } = useContext(NFTMarketplaceContext);
  // useEffect(() => {
  //   checkWalletConnection();
  // }, []);

  return (
    <div>
        <div className={Style.homePage}>

            <MainSection/>
            {/* <Title
              heading="New Collection"
              paragraph="Explore the NFT in the most featured categories."
            /> */}
           <br/>
            <Title
              heading="Top Listed Barters"
              paragraph="Explore the NFT in the most featured categories."
            />
            <NFTSlider />
            {/* <Collection /> */}
            <Title
              heading="Featured Items"
              paragraph="Explore creators products in the most featured categories."
            />
            <Filter />
            <NFTCard />
            <Title
              heading="Browse by Category"
              paragraph="Explore the NFT in the most featured categories."
            />
            <Category />
        </div>
    </div>
  );
};

export default Home;
