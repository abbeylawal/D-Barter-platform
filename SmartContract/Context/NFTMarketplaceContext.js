import React, { useState, useEffect, useContext } from "react";
import web3Modal from "web3modal";
import { ethers } from "ethers";
import Router from "next/router";

// Internal Import

import { NFTMarketplaceAddress, NFTMarketplaceABI } from "./constants"
export const NFTMarketplaceContext = React.createcontext();

export const NFTMarketplaceProvider = (({children}) => {
    const titleData = "Discover, Create and Barter your items";
    return (
        <NFTMarketplaceContext.Provider value={{ titleData }} >
            {children}
        </NFTMarketplaceContext>
    )
});