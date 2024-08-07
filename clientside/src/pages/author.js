import React, { useState } from "react";
import Style from "../styles/author.module.css";
import { Banner, NFTCardTwo, Title } from "../components/componentsIndex";
import images from "../asserts/img";
import {
  AuthorProfileCard,
  AuthorTabs,
  AuthorNFTCard,
} from "./AuthorPage/compIndex";
const author = () => {
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
  const [collectables, setCollectables] = useState(true);
  const [created, setCreated] = useState(true);
  const [listed, setListed] = useState(false);
  const [like, setLike] = useState(false);
  const [follower, setFollower] = useState(false);
  const [following, setFollowing] = useState(false);

  return (
    <div className={Style.Author}>
      <Banner bannerImage={images.creatorbackground10} />
      <AuthorProfileCard />
      <AuthorTabs
        collectables={setCollectables}
        created={setCreated}
        listed={setListed}
        like={setLike}
      />
      <AuthorNFTCard
        collectables={collectables}
        created={created}
        listed={listed}
        like={like}
      />
      {/* <Title */}
    </div>
  );
};

export default author;
