import Image from 'next/image';
import React, { useState } from 'react';
import { BsImage } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MdTimer } from "react-icons/md";
import images from "../../../assets/img";
import styles from "./NFTCardMain.module.css";

const NFTData = [
    {
        id: 1,
        image: images.NFT_image_4,
        name: 'Cosmic Voyager #1',
        price: 4.2,
        swapWith: 15,
        timeLeft: 3,
    },
    {
        id: 2,
        image: images.NFT_image_7,
        name: 'Digital Dreams #2',
        price: 3.8,
        swapWith: 16,
        timeLeft: 5,
    },
    {
        id: 3,
        image: images.NFT_image_2,
        name: 'Neon Nights #3',
        price: 5.1,
        swapWith: 17,
        timeLeft: 2,
    },
];

const NFTCard = ({ nft }) => {
    const [like, setLike] = useState(false);
    const [likeInc, setLikeInc] = useState(21);

    const likeNFT = () => {
        setLike(!like);
        setLikeInc(like ? likeInc - 1 : likeInc + 1);
    };

    return (
        <div className={styles.NFTCardMain_box}>
            <div className={styles.NFTCardMain_box_like}>
                <div className={styles.NFTCardMain_box_like_box}>
                    <button onClick={likeNFT} className={styles.likeButton}>
                        {like ? <AiOutlineHeart /> : <AiFillHeart />}
                        <span>{likeInc}</span>
                    </button>
                </div>
            </div>
            <div className={styles.NFTCardMain_box_img}>
                <Image
                    src={nft.image}
                    alt={nft.name}
                    width={500}
                    height={500}
                    objectFit='cover'
                />
            </div>
            <div className={styles.NFTCardMain_box_info}>
                <div className={styles.NFTCardMain_box_info_left}>
                    <p>{nft.name}</p>
                </div>
                <small>{nft.price} ETH</small>
            </div>
            <div className={styles.NFTCardMain_box_price}>
                <div className={styles.NFTCardMain_box_price_box}>
                    <small>Swap with</small>
                    <p>{nft.swapWith}</p>
                </div>
                <p className={styles.NFTCardMain_box_price_stock}>
                    <MdTimer /> <span>{nft.timeLeft} hours left</span>
                </p>
            </div>
        </div>
    );
};

const NFTCardMain = () => {
    return (
        <div className={styles.NFTCardMain}>
            {NFTData.map((nft) => (
                <NFTCard key={nft.id} nft={nft} />
            ))}
        </div>
    );
};

export default NFTCardMain;