import React, { useState } from 'react';
import Image from "next/image";
import Style from './NFTCardTwo.module.css';
import nftData from '../../../asserts/Data/nftData.json';

const NFTCardTwo = () => {
    return (
        <div className={Style.container}>
            <div className={Style.header}>
                <div className={Style.col6}>
                    <h2>Trending Auctions</h2>
                </div>
                <div className={`${Style.col6} ${Style.textRight}`}>
                    <a href="#" className={Style.themeBtn}> View More </a>
                </div>
            </div>
            <div className={Style.trendingGrid}>
                <div className={Style.row}>
                    {nftData.map(nft => (
                        <div key={nft.id} className={Style.colMd4}>
                            <NFTCard
                                cardImage={nft.cardImage}
                                userName={nft.userName}
                                artName={nft.artName}
                                userImage={nft.userImage}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const NFTCard = ({ cardImage, userName, artName, userImage }) => {
    const [votes, setVotes] = useState(0);

    const handleUpvote = () => {
        setVotes(votes + 1);
    };

    const handleDownvote = () => {
        setVotes(votes - 1);
    };

    return (
        <div className={Style.trendingContent}>
            <Image src={cardImage} alt="card image" width={300} height={300} className={Style.cardImage} />
            <div className={Style.trendingDesc}>
                <h4 className={Style.userTitle}>{userName}</h4>
                <h3 className={Style.userPosition}>{artName}</h3>
                <div className={`${Style.vote} ${Style.dFlex}`}>
                    <button onClick={handleUpvote} className={Style.voteButton}>Upvote</button>
                    <span className={Style.voteCount}>{votes}</span>
                    <button onClick={handleDownvote} className={Style.voteButton}>Downvote</button>
                </div>
                <Image src={userImage} alt="user image" width={50} height={50} className={Style.userImage} />
                <button className={Style.offerButton}>Make Offer</button>
            </div>
        </div>
    );
};

export default NFTCardTwo;