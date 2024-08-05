import React from "react";
import Style from "../styles/upload-products.module.css";
import {UploadForm} from "../UploadProduct/ProductIndex";

const upload_products = () => {
  return (
    <div className={Style.uploadProducts}>
      <h1>Upload Product</h1>
      <UploadForm />
    </div>
  );
};

export default upload_products;
