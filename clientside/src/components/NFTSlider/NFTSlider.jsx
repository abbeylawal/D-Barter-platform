import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { AiFillFire, AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { MdVerified, MdTimer } from 'react-icons/md';
import { TbArrowBigLeftLines, TbArrowBigRightLines  } from 'react-icons/tb';

import Style from "./NFTSlider.module.css";
import images from '../../img';
import Button from "../Button/Button";

const NFTSlider = () => {
    const [idNumber, setIdNumber] = useState(1);
    const sliderData = [
        {
            title: "Hello NFT",
            id: 1,
            name: "Muftau Lawal",
            collection: "Books",
            price: "0000006464444 ETH",
            like: 243,
            image: images.user1,
            nftImage: images.nft_image_1,
            time:{
                day: 27,
                hours: 10,
                minutes: 11,
                seconds: 6,
            },
        },
        {
            title: "Hello NFT",
            id: 1,
            name: "Muftau Lawal",
            collection: "Books",
            price: "0000006464444 ETH",
            like: 243,
            image: images.user2,
            nftImage: images.nft_image_2,
            time:{
                day: 27,
                hours: 10,
                minutes: 11,
                seconds: 6,
            },
        },
        {
            title: "Hello NFT",
            id: 1,
            name: "Muftau Lawal",
            collection: "Books",
            price: "0000006464444 ETH",
            like: 243,
            image: images.user2,
            nftImage: images.nft_image_2,
            time:{
                day: 27,
                hours: 10,
                minutes: 11,
                seconds: 6,
            },
        },
        {
            title: "Pure Games",
            id: 1,
            name: "Kevlin Smith",
            collection: "Accessories",
            price: "0000006464444 ETH",
            like: 243,
            image: images.user3,
            nftImage: images.nft_image_3,
            time:{
                day: 27,
                hours: 10,
                minutes: 11,
                seconds: 6,
            },
        },
    ]


    return (
        <div className={Style.NFTSlider}>
            <div className={Style.NFTSlider_box}>
                <div className={Style.NFTSlider_box_left}>
                    <h2>{sliderData[idNumber].title}</h2>
                    <div className={Style.NFTSlider_box_left_creator}>
                        <div className={Style.NFTSlider_box_left_creator_profile}>
                            <Image 
                            className={Style.NFTSlider_box_left_creator_profile_img}
                                src={sliderData[idNumber].image}
                                alt="Nft creator imag"
                                width={50}
                                height={50}
                            />
                            <div className={Style.NFTSlider_box_left_creator_profile_img}>
                                <p>Creator</p>
                                <h4>{sliderData[idNumber].name} 
                                    <span><MdVerified /></span>
                                </h4>
                            </div>
                        </div>


                        <div className={Style.NFTSlider_box_left_creator_collection}>
                            <AiFillFire className={Style.NFTSlider_box_left_creator_collection_icon}/>
                            <div className={Style.NFTSlider_box_left_creator_collecion_info}>
                                <p>Collection</p>
                                <h4> 
                                    {sliderData[idNumber].collection}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default NFTSlider