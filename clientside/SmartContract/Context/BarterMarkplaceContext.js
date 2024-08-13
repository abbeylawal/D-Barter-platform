import React, { useState, useEffect, createContext, useContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import { BarterMarketplaceAddress, BarterMarketplaceABI } from "./constants";

const BarterMarketplaceContext = createContext();

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(
    BarterMarketplaceAddress,
    BarterMarketplaceABI,
    signerOrProvider
  );

export const BarterMarketplaceProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");

    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log("No accounts found");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

    setCurrentAccount(accounts[0]);
    window.location.reload();
  };

  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.log("Error uploading file to IPFS");
    }
  };

  const createItem = async (formInput, fileUrl) => {
    const { name, description, category } = formInput;
    if (!name || !description || !category || !fileUrl) return;

    const data = JSON.stringify({ name, description, image: fileUrl });

    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      const contract = await connectToContract();
      const transaction = await contract.createItem(url, category);

      await transaction.wait();
    } catch (error) {
      console.log("Error creating item:", error);
    }
  };

  const createListing = async (tokenId, desiredCategories) => {
    try {
      const contract = await connectToContract();
      const transaction = await contract.createListing(tokenId, desiredCategories);
      await transaction.wait();
    } catch (error) {
      console.log("Error creating listing:", error);
    }
  };

  const makeOffer = async (listingId, offeredTokenId) => {
    try {
      const contract = await connectToContract();
      const transaction = await contract.makeOffer(listingId, offeredTokenId);
      await transaction.wait();
    } catch (error) {
      console.log("Error making offer:", error);
    }
  };

  const acceptOffer = async (listingId, offerIndex) => {
    try {
      const contract = await connectToContract();
      const transaction = await contract.acceptOffer(listingId, offerIndex);
      await transaction.wait();
    } catch (error) {
      console.log("Error accepting offer:", error);
    }
  };

  const completeSwap = async (htlcId) => {
    try {
      const contract = await connectToContract();
      const transaction = await contract.completeSwap(htlcId);
      await transaction.wait();
    } catch (error) {
      console.log("Error completing swap:", error);
    }
  };

  const fetchListings = async () => {
    try {
      const contract = await connectToContract();
      const listings = await contract.getListings();
      return listings;
    } catch (error) {
      console.log("Error fetching listings:", error);
    }
  };

  const fetchOffersForListing = async (listingId) => {
    try {
      const contract = await connectToContract();
      const offers = await contract.getOffersForListing(listingId);
      return offers;
    } catch (error) {
      console.log("Error fetching offers:", error);
    }
  };

  const connectToContract = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    return contract;
  };

  return (
    <BarterMarketplaceContext.Provider
      value={{
        currentAccount,
        connectWallet,
        createItem,
        createListing,
        makeOffer,
        acceptOffer,
        completeSwap,
        fetchListings,
        fetchOffersForListing,
        uploadToIPFS,
      }}
    >
      {children}
    </BarterMarketplaceContext.Provider>
  );
};

export const useBarterMarketplace = () => useContext(BarterMarketplaceContext);