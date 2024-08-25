import React, { useState } from 'react';
import Image from 'next/image';
import { BsImages } from 'react-icons/bs';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

import Style from "./ProductDetailsImg.module.css";
import images from "../../../assets/img";

const ProductDetailsImg = ({ nft }) => {
    const [description, setDescription] = useState(false);
    const [details, setDetails] = useState(true);
    const [like, setLike] = useState(false);
    const [likes, setLikes] = useState(nft.likes || Math.floor(Math.random() * 501) + 1);
    const imageSrc = nft.image || images[`NFT_image_${nft.tokenId}`];

    const likeNFT = () => {
        setLike(!like);
        setLikes(prevLikes => like ? prevLikes - 1 : prevLikes + 1);
    };

    const openDescription = () => {
        setDescription(!description);
    };

    const openDetails = () => {
        setDetails(!details);
    };

    return (
        <div className={Style.ProductDetailsImg}>
            <div className={Style.ProductDetailsImg_box}>
                <div className={Style.ProductDetailsImg_box_NFT}>
                    <div className={Style.ProductDetailsImg_box_NFT_like}>
                        <BsImages className={Style.like_icon} />
                        <p onClick={likeNFT} style={{ cursor: 'pointer' }}>
                            {
                                like ? (
                                    <AiFillHeart className={Style.like_icon} style={{ color: 'red' }} />
                                ) : (
                                    <AiOutlineHeart className={Style.like_icon} />
                                )
                            }
                            <span> {likes} </span>
                        </p>
                    </div>

                    <div className={Style.ProductDetailsImg_box_NFT_img}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%'
                        }}
                    >
                        <Image
                            className={Style.ProductDetailsImg_box_NFT_img_img}
                            src={imageSrc}
                            width={600}
                            height={600}
                            objectFit="cover"
                            alt="NFT Image"
                        />
                    </div>
                </div>

                <div className={Style.box_description} onClick={openDescription}>
                    <p>Description</p>
                    {description ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
                </div>

                {
                    description && (
                        <div className={Style.Img_box_description_box}>
                            <p>
                                {nft.description}
                            </p>
                        </div>
                    )
                }

                <div className={Style.Img_box_details} onClick={openDetails}>
                    <p>Details</p>
                    {details ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
                </div>

                {
                    details && (
                        <div className={Style.Img_box_details_box}>
                            <small>2000 * 2000 px. IMAGE (658KG)</small>
                            <p>
                                <small>Contact Address</small>
                                <br />
                                {nft.owner}
                            </p>
                            <p>
                                <small>Token ID</small>{" "}
                                {nft.tokenId}
                            </p>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default ProductDetailsImg;
