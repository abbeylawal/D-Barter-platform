import React, { useState } from "react";
import Style from "../styles/product-details.module.css";
import { Button, Category } from "../components/componentsIndex";
// import { ProductDescription, ProductDetailsImg, ProductTabs } from "./ProductDetailsPage/ProductDetailsIndex";
import ProductDetailsPage from "./ProductDetailsPage/ProductDetailsPage";

const product_details = () => {
  return (
    <div className={Style.product_details}>
      <ProductDetailsPage />
      <Category />
    </div>
  );
};

export default product_details;
