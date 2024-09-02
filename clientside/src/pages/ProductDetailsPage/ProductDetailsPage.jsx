import React from 'react'
import Style from "./ProductDetailsPage.module.css";
import { ProductDescription, ProductDetailsImg, ProductTabs } from "./ProductDetailsIndex";

const ProductDetailsPage = ({nft}) => {
    return (
        <div className={Style.ProductDetailsPage} >
            <div className={Style.ProductDetailsPage_box}>
                <ProductDetailsImg nft={nft} />
                <ProductDescription nft={nft} />
            </div>
        </div>
    )
};

export default ProductDetailsPage;