import React, { useState } from 'react';
import Image from 'next/image';
import { BsImages } from 'react-icons/bs';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

import Style from "./ProductDetailsImg.module.css";
import images from "../../../assets/img";

const ProductDetailsImg = () => {
    const [description, setDescription] = useState(false);
    const [details, setDetails] = useState(true);
    const [like, setLike] = useState(false);

    const likeNFT = () => {
        setLike(!like);
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
                        <p onClick={likeNFT}>
                            {
                                like ? (
                                    <AiFillHeart className={Style.like_icon} />
                                ) : (
                                    <AiOutlineHeart className={Style.like_icon} />
                                )
                            }
                            <span>23</span>
                        </p>
                    </div>

                    <div className={Style.ProductDetailsImg_box_NFT_img}>
                        <Image
                            className={Style.ProductDetailsImg_box_NFT_img_img}
                            src={images.nft_image_1}
                            width={600}
                            height={600}
                            // width={700}
                            // height={800}
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
                            <p>Tattooed Kitty Gang</p>
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
                                0x50f54473530e4f9w801711c
                            </p>
                            <p>
                                <small>Token ID</small>
                                <br />
                                12209203800
                            </p>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default ProductDetailsImg;
