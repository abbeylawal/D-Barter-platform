import React, { useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BsImages } from 'react-icons/bs';
import Image from "next/image";
import styles from './NFTCard.module.css';
import images from "../../assets/img";
import Link from "next/link";
import userData from "../../assets/Data/userData.json";

const NFTCard = ({ initialCardArray }) => {
    const [cardArray, setCardArray] = useState(initialCardArray);

    const likeNft = (tokenId) => {
        setCardArray(prevArray =>
            prevArray.map(card =>
                card.id ===tokenId
                    ? { ...card, liked: !card.liked, likes: card.liked ? card.likes - 1 : card.likes + 1 }
                    : card
            )
        );
    };


        // Helper function to get user image by creatorId
    const getUserImageById = (creatorId) => {
        const user = userData.find(user => user.userId === creatorId);
        return user ? user.userImage : images.user2;
    };

    return (
        <div className={styles.NFTCard}>
            {cardArray.map((card, i) => (
                <Link href={{ pathname: "/product-details", query: card }} key={i + 1}>
                    <div className={styles.NFTCard_box}>
                        <div className={styles.NFTCard_box_img}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: '100%'
                            }}
                        >
                            <Image
                                src={card.image}
                                alt={card.name}
                                width={385}
                                height={350}
                                className={styles.NFTCard_box_img_img}
                                objectFit='contain'
                            />
                        </div>

                        <div className={styles.NFTCard_box_update}>
                            <div className={styles.NFTCard_box_update_left}>
                                <div
                                    className={styles.NFTCard_box_update_left_like}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        likeNft(card.id);
                                    }}
                                >
                                    {card.liked ? (
                                        <AiFillHeart className={styles.NFTCard_box_update_left_like_icon} />
                                    ) : (
                                        <AiOutlineHeart />
                                    )}
                                    {""} {card.likes}
                                </div>
                            </div>

                            <div className={styles.NFTCard_box_update_right}>
                                <div className={styles.NFTCard_box_update_right_info}>
                                    <small>Duration</small>
                                    <p>{card.remainingTime}</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.NFTCard_box_update_details}>
                            <div className={styles.NFTCard_box_update_details_price}>
                                <div className={styles.NFTCard_box_update_details_price_box}>
                                    <h4>{card.name}</h4>

                                    <div className={styles.NFTCard_box_update_details_price_box_box}>
                                        <div className={styles.NFTCard_box_update_details_price_box_bid}>
                                            <small>Category</small>
                                            <p>{card.category || card.Category}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`${styles.NFTCard_box_update_details_category} hover-scale-image`}>
                                <Image
                                    src={getUserImageById(card.creatorId)}
                                    alt="User Image"
                                    width={50}
                                    height={50}
                                    style={{
                                        marginRight: "-1.5rem",
                                        borderRadius: '50%',
                                        border: '2px solid #000',
                                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                        transform: 'scale(1.1)',
                                        transition: 'transform 0.3s ease',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

// Default props if none are provided
NFTCard.defaultProps = {
    initialCardArray: [
        {
           tokenId: 1,
            image: images.NFT_image_1,
            name: "MacBook",
            description: "MacBook Pro",
            creatorId: 2,
            stock: 51,
            likes: 22,
            remainingTime: "3h: 15m",
           category: "Computer",
            swapCategory: ["Computer"],
            liked: false
        },
        {
           tokenId: 2,
            image: images.NFT_image_2,
            name: "Dream Headset",
            creatorId: 1,
            stock: 37,
            likes: 18,
            remainingTime: "5h: 30m",
           category: "Fashion",
            swapCategory: ["Fashion"],
            liked: false
        },
        {
           tokenId: 3,
            image: images.NFT_image_3,
            name: "Nike Air",
            creatorId: 3,
            stock: 25,
            likes: 30,
            remainingTime: "2h: 45m",
           category: "Fashion",
            swapCategory: ["Art", "Fashion", "Gadget"],
            liked: false
        },
        {
           tokenId: 4,
            image: images.NFT_image_4,
            name: "IphoneX",
            creatorId: 2,
            stock: 25,
            likes: 30,
            remainingTime: "2h: 45m",
           category: "Mobile",
            swapCategory: ["Art", "Fashion", "Gadget"],
            liked: false
        },
        {
           tokenId: 5,
            image: images.NFT_image_5,
            name: "Hoodies",
            creatorId: 5,
            stock: 25,
            likes: 30,
            remainingTime: "4h: 45m",
           category: "Fashion",
            swapCategory: ["Art", "Fashion", "Gadget"],
            liked: false
        },
        {
           tokenId: 6,
            image: images.NFT_image_6,
            name: "jacket",
            creatorId: 4,
            stock: 25,
            likes: 30,
            remainingTime: "6h: 45m",
           category: "Fashion",
            swapCategory: ["Art", "Fashion", "Gadget"],
            liked: false
        },
        {
           tokenId: 7,
            image: images.NFT_image_7,
            name: "Classic Hills",
            // creatorId: 1,
            stock: 25,
            likes: 30,
            remainingTime: "6h: 45m",
           category: "Fashion",
            swapCategory: ["Art", "Fashion", "Gadget"],
            liked: false
        },
        {
           tokenId: 8,
            image: images.NFT_image_8,
            name: "Abstract",
            creatorId: 1,
            stock: 25,
            likes: 30,
            remainingTime: "6h: 45m",
           category: "Art",
            swapCategory: ["Art", "Fashion", "Gadget"],
            liked: false
        },
        {
           tokenId: 9,
            image: images.NFT_image_9,
            name: "Glow Dress",
            stock: 25,
            likes: 30,
            remainingTime: "6h: 45m",
           category: "Art",
            swapCategory: ["Art", "Fashion", "Gadget"],
            liked: false
        },
    ]
};

export default NFTCard;