import React, { useState, useEffect, useContext } from "react";
import Web3Modal from "web3modal"; // Capitalize 'Web3Modal'
import { ethers } from "ethers";
import Router from "next/router";

// Internal Import
import { NFTMarketplaceAddress, NFTMarketplaceABI } from "./constants";

// Create the context
export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = "Discover, Create and Barter your items";

  return (
    <NFTMarketplaceContext.Provider value={{ titleData }}>
      {children}
    </NFTMarketplaceContext.Provider>
  );
};
