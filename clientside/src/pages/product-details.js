import React, { useState, useEffect, useContext } from "react";
import {useRouter} from "next/router";
import Style from "../styles/product-details.module.css";
import { Button, Category } from "../components/componentsIndex";
// import { ProductDescription, ProductDetailsImg, ProductTabs } from "./ProductDetailsPage/ProductDetailsIndex";
import ProductDetailsPage from "./ProductDetailsPage/ProductDetailsPage";


// SMART CONTRACT
import { NFTMarketplaceContext } from "../../SmartContract/Context/NFTMarketplaceContext";

const product_details = () => {
  const { currentAccount } = useContext(NFTMarketplaceContext);
  
  const [nft, setNft] = useState({
    image: "",
    tokenId: "",
    name: "",
    owner: "",
    seller: "",
  });
  
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    setNft(router.query);
  }, [router.isReady]);
  return (
    <div className={Style.product_details}>
      <ProductDetailsPage nft={nft} />
      <Category />
    </div>
  );
};

export default product_details;
