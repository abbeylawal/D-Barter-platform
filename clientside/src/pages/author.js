import React , {useState} from "react";
import Style from "../styles/author.module.css";
import {Banner, NFTCardTwo, Title} from "../components/componentsIndex";
import images from "../asserts/img";
import {AuthorProfileCard, AuthorTaps, TabCard } from "./AuthorPage/compIndex";
const author = () => {
    const popularArry = [
        images.user1,
        images.user2,
        images.user3,
        images.user4,
        images.user5,
        images.user6,
        images.user7,
        images.user8,
        images.user9,
    ]
    const [collectiables, setCollectiables] = useState(true);
    const [created, setCreated] = useState(true);
    const [like, setLike] = useState(false);
    const [follower, setFollower] = useState(false);
    const [following, setFollowing] = useState(false);

    return (
        <div className={Style.Author} >
            <Banner bannerImage={images.creatorbackground10} />
            <AuthorProfileCard/>
        </div>
    )
};

export default author;
