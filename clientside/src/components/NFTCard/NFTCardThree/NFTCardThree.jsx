import React, { useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BsClock } from 'react-icons/bs';
import Style from './NFTCardThree.module.css';


const NFTCardThree = () => {
    const [liked, setLiked] = useState(false);

    const toggleLike = () => {
        setLiked(!liked);
    };

    const nftData = [
        { id: 1, name: "Name NFT #1" },
        { id: 2, name: "Name NFT #2" },
        { id: 3, name: "Name NFT #3" },
    ];

    const categories = ["Fashion", "Art", "Music"];

    return (
        <div className={Style.nftCardContainer}>
            {nftData.map((nft) => (
                <div key={nft.id} className={Style.nftCard}>
                    <div className={Style.nftImageContainer}>
                        <img
                            // src="/api/placeholder/400/400"
                            src="https://yt3.ggpht.com/QjvZEAyWwOGtkY4D36Q8tiblGg3vXwaohmUkr_zMNGatyLEniLkWq_MRpC7RaZNtoXbbcvC5tw=s900-c-k-c0x00ffffff-no-rj"
                            alt={`NFT ${nft.id}`}
                            className={Style.nftImage}
                        />
                        <div className={Style.likeButton}>
                            <button onClick={toggleLike}>
                                {liked ? (
                                    <AiFillHeart className={Style.likedIcon} />
                                ) : (
                                    <AiOutlineHeart className={Style.likeIcon} />
                                )}
                            </button>
                            <span className={Style.likeCount}>69</span>
                        </div>
                    </div>
                    <div className={Style.nftInfo}>
                        <h3 className={Style.nftName}>{nft.name}</h3>
                        <p className={Style.authorName}>@author_name</p>
                        <div className={Style.nftDetails}>
                            <div>
                                <p className={Style.categoryInfo}>CATEGORY ({Math.floor(Math.random() * 3) + 1} / 3)</p>
                                <p className={Style.category}>{categories[Math.floor(Math.random() * categories.length)]}</p>
                            </div>
                            <div className={Style.timeLeft}>
                                <BsClock className={Style.clockIcon} />
                                <span>21 hours left</span>
                            </div>
                        </div>
                        <button className={Style.buyButton}>
                            Buy
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NFTCardThree;