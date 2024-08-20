import React, {useState, useEffect, useContext} from "react";
import Style from "../styles/upload-products.module.css";
import {UploadForm} from "./UploadProduct/ProductIndex";

import { NFTMarketplaceContext } from "../../SmartContract/Context/NFTMarketplaceContext";

const upload_products = () => {
  const { uploadToIPFS, createNFT } = useContext(NFTMarketplaceContext);

  return (
    <div className={Style.uploadProducts}>
      <div className={Style.uploadProducts_box} >
        <div className={Style.uploadProducts_box_heading}>
          <h1>Create New NFT</h1>
          <p>
            create and manage your personal items,
            set preferred display name, category and swap preference
            </p>
        </div>
        <div className={Style.uploadProducts_box_title}>
          {/* <h2>Image, Video, Audio, or 3D Model </h2> */}
          <p> 
            File types supported: JPG, PNG, GIF
            Max size: 100 MB
          </p>
        </div>
        <div className={Style.uploadProducts_box_form}>

          <UploadForm uploadToIPFS = {uploadToIPFS} createNFT = {createNFT} />
        </div>

      </div>
    </div>
  );
};

export default upload_products;
