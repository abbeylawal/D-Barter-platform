import React, { useState } from 'react';
import {
    AiFillHeart,
    AiOutlineHeart
} from 'react-icons/ai';
import Image from "next/image";
import { BsImages } from 'react-icons/bs';

// INTERNAL IMPORT
import Style from './NFTCard.module.css';
import images from "../../assets/img";


const NFTCard = () => {

    const CardArray = [
        images.NFT_image_1,
        images.NFT_image_3,
        images.NFT_image_2,
        images.NFT_image_6,
        images.NFT_image_7,
        images.NFT_image_5,
        images.NFT_image_9,
        images.NFT_image_4,
        images.NFT_image_2,
    ];

    const [like, setLike] = useState(true);

    const likeNft = () => {
        setLike(!like);
    };

    return (
        <div className={Style.NFTCard}>
            {CardArray.map((el, i) => (
                <div className={Style.NFTCard_box} key={i + 1}>
                    <div className={Style.NFTCard_box_img}>
                        <Image
                            src={el}
                            // src={images[`nft_image_${i + 1}`]}
                            alt='NFT images'
                            width={385}
                            height={350}
                            className={Style.NFTCard_box_img_img}
                            objectFit='contain'
                        />
                    </div>

                    <div className={Style.NFTCard_box_update}>
                        <div className={Style.NFTCard_box_update_left}>
                            <div
                                className={Style.NFTCard_box_update_left_like}
                                onClick={() => likeNft()}
                            >
                                {like ? (
                                    <AiOutlineHeart />
                                ) : (
                                    <AiFillHeart className={Style.NFTCard_box_update_left_like_icon} />
                                )}
                                {""} 22
                            </div>
                        </div>

                        <div className={Style.NFTCard_box_update_right}>
                            <div className={Style.NFTCard_box_update_right_info}>
                                <small> Remaining time</small>
                                <p>3h: 15m : 20s</p>
                            </div>
                        </div>
                    </div>

                    <div className={Style.NFTCard_box_update_details}>
                        <div className={Style.NFTCard_box_update_details_price}>
                            <div className={Style.NFTCard_box_update_details_price_box}>
                                <h4>Clone #17373</h4>

                                <div className={Style.NFTCard_box_update_details_price_box_box}>
                                    <div className={Style.NFTCard_box_update_details_price_box_bid}>
                                        <small>Current Bid</small>
                                        <p>1.000ETH</p>
                                    </div>
                                    <div className={Style.NFTCard_box_update_details_price_box_stock}>
                                        <small>51 in stock</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={Style.NFTCard_box_update_details_category}>
                            <BsImages />
                        </div>
                        {/* div.{Style.NFTCard_box_update_details_category} */}
                    </div>
                </div>
            ))}
        </div>
    )
};

export default NFTCard;