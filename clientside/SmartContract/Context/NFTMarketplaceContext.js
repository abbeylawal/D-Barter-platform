import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import { NFTMarketplaceAddress, NFTMarketplaceABI } from "./constants";

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(
    NFTMarketplaceAddress,
    NFTMarketplaceABI,
    signerOrProvider
  );

const connectSmartContract = async () => {
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    return contract;
  } catch (error) {
    console.log("Error connecting to Smart Contract:", error);
  }
};

export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = "Barter Easy Smart Contract App";
  const titleCover =
    "Barter Easy is a platform that simplifies bartering through smart contracts. By using blockchain, it ensures secure, transparent, and automated trades without intermediaries. Whether for digital or physical items, Barter Easy offers a user-friendly interface for seamless and trustworthy transactions.";

  const [currentAccount, setCurrentAccount] = useState("");
  const [listingPrice, setListingPrice] = useState("0");

  const checkWalletConnection = async () => {
    try {
      if (!window.ethereum) return console.log("Please install MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No Account Found");
      }
    } catch (error) {
      console.log("Error while connecting to wallet:", error);
    }
  };

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return console.log("Please install MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Error while connecting to wallet:", error);
    }
  };

  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.log("Error uploading to IPFS:", error);
    }
  };

  const createSale = async (url, formInputPrice, isReselling, id) => {
    try {
      const contract = await connectSmartContract();
      const price = ethers.utils.parseUnits(formInputPrice, "ether");

      const transaction = !isReselling
        ? await contract.createToken(url, price, {
            value: listingPrice,
          })
        : await contract.resellToken(id, price, {
            value: listingPrice,
          });

      await transaction.wait();
    } catch (error) {
      console.log("Error creating sale:", error);
    }
  };

  const createNFT = async (formInput, fileUrl) => {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;

    const data = JSON.stringify({ name, description, image: fileUrl });

    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      await createSale(url, price);
    } catch (error) {
      console.log("Error creating NFT:", error);
    }
  };

  const fetchNFTs = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);

      const data = await contract.fetchMarketItems();

      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            const {
              data: { image, name, description },
            } = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              name,
              description,
              tokenURI,
            };
          }
        )
      );

      return items;
    } catch (error) {
      console.log("Error fetching NFTs:", error);
    }
  };

  const fetchMyNFTsOrListedNFTs = async (type) => {
    try {
      const contract = await connectSmartContract();

      const data =
        type == "fetchItemsListed"
          ? await contract.fetchItemsListed()
          : await contract.fetchMyNFTs();

      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            const {
              data: { image, name, description },
            } = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              name,
              description,
              tokenURI,
            };
          }
        )
      );

      return items;
    } catch (error) {
      console.log("Error fetching listed NFTs:", error);
    }
  };
  const buyNFT = async (nft) => {
    try {
      const contract = await connectSmartContract();
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });

      await transaction.wait();
    } catch (error) {
      console.log("Error buying NFT:", error);
    }
  };

  const listForBarter = async (tokenId, desiredTokenId) => {
    try {
      const contract = await connectSmartContract();
      const transaction = await contract.listForBarter(tokenId, desiredTokenId);
      await transaction.wait();
    } catch (error) {
      console.log("Error listing for barter:", error);
    }
  };

  const acceptBarterTrade = async (offeredTokenId, desiredTokenId) => {
    try {
      const contract = await connectSmartContract();
      const transaction = await contract.acceptBarterTrade(
        offeredTokenId,
        desiredTokenId
      );
      await transaction.wait();
    } catch (error) {
      console.log("Error accepting barter trade:", error);
    }
  };

  const fetchBarterItems = async () => {
    try {
      const contract = await connectSmartContract();
      const data = await contract.fetchBarterItems();

      const items = await Promise.all(
        data.map(async ({ tokenId, owner, desiredTokenId, available }) => {
          const tokenURI = await contract.tokenURI(tokenId);
          const {
            data: { image, name, description },
          } = await axios.get(tokenURI);

          return {
            tokenId: tokenId.toNumber(),
            owner,
            desiredTokenId: desiredTokenId.toNumber(),
            available,
            image,
            name,
            description,
          };
        })
      );

      return items;
    } catch (error) {
      console.log("Error fetching barter items:", error);
    }
  };

  useEffect(() => {
    fetchListingPrice();
  }, []);

  const fetchListingPrice = async () => {
    try {
      const contract = await connectSmartContract();
      const price = await contract.getListingPrice();
      setListingPrice(price.toString());
    } catch (error) {
      console.log("Error fetching listing price:", error);
    }
  };

  return (
    <NFTMarketplaceContext.Provider
      value={{
        connectWallet,
        uploadToIPFS,
        createNFT,
        fetchNFTs,
        fetchMyNFTsOrListedNFTs,
        buyNFT,
        createSale,
        currentAccount,
        titleData,
        titleCover,
        listingPrice,
        listForBarter,
        acceptBarterTrade,
        fetchBarterItems,
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};

// export const useNFTMarketplace = () => React.useContext(NFTMarketplaceContext);
