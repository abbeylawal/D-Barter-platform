import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { AiFillFire, AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { MdVerified, MdTimer } from 'react-icons/md';
import { TbArrowBigLeftLines, TbArrowBigRightLines } from 'react-icons/tb';

import Style from "./NFTSlider.module.css";
import images from '../../assets/img';
import Button from "../Button/Button";

const NFTSlider = () => {
    const [idNumber, setIdNumber] = useState(1);

    const [sliderData, setSliderData] = useState([
        {
            title: "Dream Headset",
            id: 1,
            name: "Muftau Lawal",
            collection: "Books",
            price: "0000006464444 ETH",
            swapCategory: ["Art", "Fashion", "Gadget"],
            like: 243,
            liked: false,
            creatorImage: images.user1,
            nftImage: images.NFT_image_9,
            time: {
                day: 6,
                hours: 10,
                minutes: 11,
                seconds: 6,
            },
        },
        {
            title: "Hello NFT",
            id: 2,
            name: "Muftau Lawal",
            collection: "Books",
            price: "0000006464444 ETH",
            swapCategory: ["Gadget", "Electronics"],
            like: 207,
            liked: false,
            creatorImage: images.user2,
            nftImage: images.NFT_image_2,
            time: {
                day: 5,
                hours: 18,
                minutes: 11,
                seconds: 4,
            },
        },
        {
            title: "Hello NFT",
            id: 3,
            name: "Muftau Lawal",
            collection: "Books",
            price: "0000006464444 ETH",
            swapCategory: ["Art", "Books"],
            like: 180,
            liked: false,
            creatorImage: images.user2,
            nftImage: images.NFT_image_8,
            time: {
                day: 5,
                hours: 12,
                minutes: 11,
                seconds: 55,
            },
        },
        {
            title: "Pure Games",
            id: 4,
            name: "Kevlin Smith",
            collection: "Accessories",
            price: "0000006464444 ETH",
            swapCategory: ["Games", "Accessories"],
            like: 165,
            liked: false,
            creatorImage: images.user3,
            nftImage: images.NFT_image_7,
            time: {
                day: 3,
                hours: 8,
                minutes: 16,
                seconds: 6,
            },
        },
    ]);

    const inc = useCallback(() => {
        setIdNumber((prevId) => (prevId + 1) % sliderData.length);
    }, [sliderData.length]);

    const dec = useCallback(() => {
        setIdNumber((prevId) => (prevId - 1 + sliderData.length) % sliderData.length);
    }, [sliderData.length]);

    const handleLike = () => {
        setSliderData(prevData => {
            const newData = [...prevData];
            const currentItem = newData[idNumber];
            currentItem.liked = !currentItem.liked;
            currentItem.like += currentItem.liked ? 1 : -1;
            return newData;
        });
    };

    useEffect(() => {
        const timer = setInterval(() => {
            inc();
        }, 4000);

        return () => clearInterval(timer);
    }, [inc]);

    const currentNFT = sliderData[idNumber];


    return (
        <div className={Style.NFTSlider}>
            <div className={Style.NFTSlider_box}>
                <div className={Style.NFTSlider_box_left}>
                    <h2>{sliderData[idNumber].title}</h2>
                    <div className={Style.NFTSlider_box_left_creator}>
                        <div className={Style.NFTSlider_box_left_creator_profile}>
                            <Image
                                className={Style.NFTSlider_box_left_creator_profile_img}
                                src={sliderData[idNumber].creatorImage}
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
                            <AiFillFire className={Style.NFTSlider_box_left_creator_collection_icon} />
                            <div className={Style.NFTSlider_box_left_creator_collection_info}>
                                <p>Collection</p>
                                <h4>
                                    {sliderData[idNumber].collection}
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div className={Style.NFTSlider_box_left_bidding}>
                        <div className={Style.NFTSlider_box_left_bidding_box}>
                            <small>Swap with</small>

                            {/* TODO: ---- fix */}

                            <ul>
                                {sliderData[idNumber].swapCategory.map((item, index) => {
                                    return (
                                        <li key={index}>
                                            {item}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        <p className={Style.NFTSlider_box_left_bidding_box_auction}>
                            <MdTimer className={Style.NFTSlider_box_left_bidding_box_icon} />
                            <span>Listing ending in</span>
                        </p>

                        <div className={Style.NFTSlider_box_left_bidding_box_timer}>

                            <div className={Style.NFTSlider_box_left_bidding_box_timer_item}>
                                <p>
                                    {sliderData[idNumber].time.day}
                                    <span>Days</span>
                                </p>
                            </div>
                            <div className={Style.NFTSlider_box_left_bidding_box_timer_item}>
                                <p>
                                    {sliderData[idNumber].time.hours}
                                    <span>Hours</span>
                                </p>
                            </div>
                            <div className={Style.NFTSlider_box_left_bidding_box_timer_item}>
                                <p>
                                    {sliderData[idNumber].time.minutes}
                                    <span>mins</span>
                                </p>
                            </div>

                        </div>

                        <div className={Style.NFTSlider_box_left_button}>
                            <Button btnName="View" handleClick={() => { }} />
                            <Button btnName="Offer" handleClick={() => { }} />
                        </div>
                    </div>

                    <div className={Style.NFTSlider_box_left_sliderBtn}>
                        <TbArrowBigLeftLines
                            className={Style.NFTSlider_box_left_sliderBtn_icon}
                            onClick={dec}
                        />
                        <TbArrowBigRightLines
                            className={Style.NFTSlider_box_left_sliderBtn_icon}
                            onClick={inc}
                        />
                    </div>
                </div>
                <div className={Style.NFTSlider_box_right}>
                    <div className={Style.NFTSlider_box_right_box}>
                        <Image
                            className={Style.NFTSlider_box_right_box_img}
                            src={currentNFT.nftImage}
                            alt="NFT Image"
                        />

                        <div
                            className={Style.NFTSlider_box_right_box_like}
                            onClick={handleLike}
                        >
                            {currentNFT.liked ? <AiFillHeart  style={{color: 'red'}} /> : <AiOutlineHeart />}
                            <span>{currentNFT.like}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default NFTSlider;