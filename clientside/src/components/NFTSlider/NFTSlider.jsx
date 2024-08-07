import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { AiFillFire, AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { MdVerified, MdTimer } from 'react-icons/md';
import { TbArrowBigLeftLines, TbArrowBigRightLines } from 'react-icons/tb';

import Style from "./NFTSlider.module.css";
import images from '../../asserts/img';
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
            time: {
                day: 27,
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
            like: 243,
            image: images.user2,
            nftImage: images.nft_image_2,
            time: {
                day: 27,
                hours: 10,
                minutes: 11,
                seconds: 6,
            },
        },
        {
            title: "Hello NFT",
            id: 3,
            name: "Muftau Lawal",
            collection: "Books",
            price: "0000006464444 ETH",
            like: 243,
            image: images.user2,
            nftImage: images.nft_image_2,
            time: {
                day: 27,
                hours: 10,
                minutes: 11,
                seconds: 6,
            },
        },
        {
            title: "Pure Games",
            id: 4,
            name: "Kevlin Smith",
            collection: "Accessories",
            price: "0000006464444 ETH",
            like: 243,
            image: images.user3,
            nftImage: images.nft_image_3,
            time: {
                day: 27,
                hours: 10,
                minutes: 11,
                seconds: 6,
            },
        },
    ]

    // ----- inc functions
    const inc = useCallback(() => {
        if (idNumber + 1 < sliderData.length) {
            setIdNumber(setIdNumber + 1);
        }
    }, [idNumber, sliderData.length]);
    // ----- dec functions
    const dec = useCallback(() => {
        if (idNumber > 0) {
            setIdNumber(setIdNumber - 1);
        }
    }, [idNumber, sliderData.length]);

    // useEffect(() => {
    //     inc();
    // });

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
                            <small>Current Bid</small>
                            <p>
                                {sliderData[idNumber].price}
                                <span>
                                    $22,121
                                </span>
                            </p>
                        </div>
                        <p className={Style.NFTSlider_box_left_bidding_box_auction}>
                            <MdTimer className={Style.NFTSlider_box_left_bidding_box_icon} />
                            <span>Auction ending in</span>
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
                            onClick={() => dec()}
                        />
                    </div>
                    <div className={Style.NFTSlider_box_left_sliderBtn}>
                        <TbArrowBigRightLines
                            className={Style.NFTSlider_box_left_sliderBtn_icon}
                            onClick={() => inc()}
                        />
                    </div>
                </div>

                <div className={Style.NFTSlider_box_right}>
                    <div className={Style.NFTSlider_box_right_box}>
                        <Image
                            // className=''
                            src={sliderData[idNumber].nftImage}
                            alt="NFT Image"
                        />

                        <div className={Style.NFTSlider_box_right_box_like}>
                            <AiFillHeart />
                            <span>{sliderData[idNumber].like} </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default NFTSlider;