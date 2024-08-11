import React, { useState } from 'react'
import Style from "./AuthorNFTCard.module.css";
import images from "../../../assets/img";
import { NFTCard } from '../../../components/componentsIndex';

const AuthorNFTCard = ({ collectables, created, listed, like }) => {

    return (
        < div className={Style.AuthorNFTCard}  >
            {collectables && <NFTCard />}
            {created && <NFTCard />}
            {listed && <NFTCard />}
            {like && <NFTCard />}
        </div>
    )
}

export default AuthorNFTCard;