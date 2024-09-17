import React, { useState, useEffect } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BsImages } from 'react-icons/bs';
import { FaLock, FaBell } from 'react-icons/fa';
import Image from "next/image";
import styles from './NFTCard.module.css';
import images from "../../assets/img";
import Link from "next/link";
import userData from "../../assets/Data/userData.json";

const NFTCard = ({ initialCardArray, activeCategory }) => {
    const [cardArray, setCardArray] = useState(initialCardArray);
    const [filteredCards, setFilteredCards] = useState([]);

    useEffect(() => {
        if (activeCategory === "All") {
            setFilteredCards(cardArray);
        } else {
            const filtered = cardArray.filter(card =>
                (card.category === activeCategory || card.Category === activeCategory) ||
                (card.swapCategory && card.swapCategory.includes(activeCategory))
            );
            setFilteredCards(filtered);
        }
    }, [activeCategory, cardArray]);
    

    const likeNft = (tokenId) => {
        setCardArray((prevArray) =>
            prevArray.map((card) =>
                card.tokenId === tokenId
                    ? {
                        ...card,
                        liked: !card.liked,
                        likes: card.liked ? card.likes - 1 : card.likes + 1,
                    }
                    : card
            )
        );
    };


    const getUserImageById = (card) => {
        let userId = 0;
        if (card.creatorId) {
            if (card.itemOwner) {
                userId = card.creatorId;
            } else {
                userId = card.creatorId - 1;
            }
        } else if (card.userId) {
            userId = card.userId;
        }
        const user = userData[userId] ? userData[userId] : null;
        return user ? user.userImage : images.user2;
    };

    return (
        <div className={styles.NFTCard}>
            {filteredCards.map((card, i) => (
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
                                        likeNft(card.tokenId);
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

                            {(card.expirationTime > 0 || card.remainingTime) && (
                                <div className={styles.NFTCard_box_update_right}>
                                    <div className={styles.NFTCard_box_update_right_info}>
                                        {card.expirationTime > 0 ? (
                                            <>
                                                {/* Show "Lock For" and remaining time until expiration if expirationTime is valid */}
                                                <small>
                                                    <FaLock style={{
                                                        marginRight: '4px',
                                                        fontSize: '1.2rem',
                                                        color: 'magenta'
                                                    }} /> Lock For
                                                </small>
                                                <p>
                                                    {card.expirationTime > Date.now() / 1000
                                                        ? `${Math.floor((card.expirationTime - Date.now() / 1000) / 3600)}h:${Math.floor(
                                                            ((card.expirationTime - Date.now() / 1000) % 3600) / 60
                                                        )}m`
                                                        : "Done"}
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                {/* Show "Duration" and remaining time if expirationTime is not valid */}
                                                <small>Duration</small>
                                                <p>{card.remainingTime || "N/A"}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Show "Pending Offer" separately if isOffered is true */}
                            {card.isOffered === true && (
                                <div className={styles.NFTCard_box_update_right}>
                                    <div className={styles.NFTCard_box_update_right_info}>
                                    <small style={{ color: 'orange', marginTop: '5px' }}>
                                            <FaBell style={{
                                                marginRight: '4px',
                                                fontSize: '1.2rem',
                                     }} />
                                        Pending
                                    </small>
                                        {/* <p style={{ color: 'blue', marginLeft: '10px' }}> */}
                                    <p>
                                        {card.activeOfferCount} Offers
                                    </p>
                                </div>
                                </div>
                            )}


                        </div>

                        <div className={styles.NFTCard_box_update_details}>
                            <div className={styles.NFTCard_box_update_details_price}>
                                <div className={styles.NFTCard_box_update_details_price_box}>
                                    <h4>{card.name.length > 10 ? `${card.name.slice(0, 10)}...` : card.name}</h4>


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
                                    src={getUserImageById(card)}
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
            creatorWallet: "0x1234567890abc...",
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
            creatorWallet: "0x1234567890abc...",
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
            creatorWallet: "0x1234567890abc...",
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
            creatorWallet: "0x1234567890abc...",
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
            creatorWallet: "0x1234567890abc...",
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
            creatorWallet: "0x1234567890abc...",
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
            creatorWallet: "0x1234567890abc...",
            stock: 25,
            likes: 45,
            remainingTime: "6h: 45m",
            category: "Fashion",
            swapCategory: ["Art", "Fashion", "Gadget"],
            liked: false
        },
        {
            tokenId: 8,
            image: images.NFT_image_8,
            name: "Abstract",
            creatorId: 4,
            creatorWallet: "0x1234567890abc...",
            stock: 25,
            likes: 28,
            remainingTime: "6h: 45m",
            category: "Art",
            swapCategory: ["Art", "Fashion", "Gadget"],
            liked: false
        },
        {
            tokenId: 9,
            image: images.NFT_image_9,
            name: "Glow Dress",
            creatorId: 1,
            creatorWallet: "0x1234567890abc...",
            stock: 25,
            likes: 12,
            remainingTime: "6h: 45m",
            category: "Art",
            swapCategory: ["Art", "Fashion", "Gadget"],
            liked: false
        },
    ]
};

export default NFTCard;