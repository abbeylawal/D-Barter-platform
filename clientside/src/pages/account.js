import Image from "next/image";
import { useState, useCallback, useContext, useMemo } from "react";
import React from "react";
import Style from "../styles/account.module.css";
import { useDropzone } from "react-dropzone";

import images from "../assets/img";

import ProfileForm from "./AccountPage/ProfileForm/ProfileForm";

const account = () => {
  const [fileUrl, setFileUrl] = useState(null);

  const onDrop = useCallback(async (acceptedFile) => {
    setFileUrl(acceptedFile[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  return (
    <div className={Style.account}>
      <div className={Style.account_info}>
        <h1>Profile Settings</h1>
        {/* <p></p> */}
      </div>
      <div className={Style.account_box}>
        <div className={Style.account_box_img} {...getRootProps()}>
          <input {...getInputProps()} />
          <Image
            src={images.user1}
            alt="account upload"
            width={150}
            height={150}
            className={Style.account_box_img_img}
          />
          <p className={Style.account_box_img_p}>Change Image</p>
        </div>
        <div className={Style.account_box_from}>
          <ProfileForm />
        </div>
      </div>
    </div>
  );
};

export default account;
