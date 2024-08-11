import React from 'react'
import Style from "./ProductDetailsPage.module.css";
import { ProductDescription, ProductDetailsImg, ProductTabs } from "./ProductDetailsIndex";

const ProductDetailsPage = () => {
    return (
        <div className={Style.ProductDetailsPage} >
            <div className={Style.ProductDetailsPage_box}>
                <ProductDetailsImg />
                <ProductDescription />

            </div>
        </div>
    )
};

export default ProductDetailsPage;