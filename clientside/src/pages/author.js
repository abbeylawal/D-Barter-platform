import React, { useState } from "react";
import Style from "../styles/author.module.css";
import { Banner, NFTCardTwo, Title } from "../components/componentsIndex";
import images from "../assets/img";
import {
  AuthorProfileCard,
  AuthorTabs,
  AuthorNFTCard,
} from "./AuthorPage/compIndex";

const Author = () => {
  const popularArray = [
    images.user1,
    images.user2,
    images.user3,
    images.user4,
    images.user5,
    images.user6,
    images.user7,
    images.user8,
    images.user9,
  ];

  const [activeTab, setActiveTab] = useState("collectables");

  return (
    <div className={Style.Author}>
      <Banner bannerImage={images.creatorbackground11} />
      <AuthorProfileCard />
      <AuthorTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <AuthorNFTCard
        collectables={activeTab === "collectables"}
        created={activeTab === "created"}
        listed={activeTab === "listed"}
        like={activeTab === "liked"}
      />
      {/* <Title */}
    </div>
  );
};

export default Author;
