import React, { useState } from 'react'
import Style from "./AuthorNFTCard.module.css";
import images from "../../../assets/img";
import { NFTCard } from '../../../components/componentsIndex';

const AuthorNFTCard = ({ collectables, owned, listed, like, nfts, myNFTs }) => {

    return (
        < div className={Style.AuthorNFTCard}  >
            {collectables && <NFTCard initialCardArray={nfts} />}
            {owned && <NFTCard initialCardArray={myNFTs} />}
            {listed && <NFTCard />}
            {like && <NFTCard />}
        </div>
    )
}

export default AuthorNFTCard;