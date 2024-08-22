import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import { create as ipfsHttpClient } from "ipfs-http-client";
const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

import { NFTMarketplaceAddress, NFTMarketplaceABI } from "./constants";
// import { error } from "console";

const fetchContract = (signerOrProvider) => {
  console.log("NFTMarketplaceAddress:", NFTMarketplaceAddress);

  return new ethers.Contract(
    NFTMarketplaceAddress,
    NFTMarketplaceABI,
    signerOrProvider
  );
};

export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = "Barter Easy";
  const titleCover =
    "Barter Easy is a platform that simplifies bartering through smart contracts. By using blockchain, it ensures secure, transparent, and automated trades without intermediaries. Whether for digital or physical items, Barter Easy offers a user-friendly interface for seamless and trustworthy transactions.";

  const [currentAccount, setCurrentAccount] = useState("");
  const [error, setError] = useState("");
  const [openError, setOpenError] = useState(false);
  // const [listingPrice, setListingPrice] = useState("0");

  const router = useRouter();

  const connectSmartContract = async () => {
    try {
      console.log("Initializing Web3Modal...");
      const web3Modal = new Web3Modal();

      console.log("Connecting to wallet...");
      const connection = await web3Modal.connect();
      console.log("Wallet connected:", connection);

      console.log("Creating provider...");
      const provider = new ethers.BrowserProvider(connection);
      console.log("Provider created:", provider);

      console.log("Getting signer...");
      const signerPromise = provider.getSigner();
      console.log("signer details:", signerPromise);

      const signer = await signerPromise;
      const userAddress = signer.address;
      console.log("Signer obtained. Address:", userAddress);

      console.log("Fetching contract...");
      const contract = fetchContract(signer);
      console.log("Contract fetched:", contract);

      return contract;
    } catch (error) {
      setOpenError(true), setError("Error connecting to Smart Contract!!!");
    }
  };

  const checkWalletConnection = async () => {
    try {
      if (!window.ethereum)
        return setOpenError(true), setError("Please install MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No Account Found");
      }
      console.log(currentAccount);
    } catch (error) {
      setOpenError(true), setError("Error while connecting to wallet");
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
      setOpenError(true), setError("Error while connecting to wallet!!!");
    }
  };




  const uploadToIPFS = async (file) => {
    if (!file) {
      setOpenError(true), setError("No file provided for upload");
      throw new Error("No file provided");
      return;
    }

    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              pinata_api_key: process.env.PINATA_API_KEY,
              pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 60000, //
          }
        );

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        console.log(`File successfully uploaded to IPFS: ${ImgHash}`);
        return ImgHash;
      } catch (error) {
        console.error(
          `Error uploading file to Pinata (Attempt ${
            retries + 1
          }/${maxRetries}):`,
          error.message
        );
        retries++;
        if (retries >= maxRetries) {
        setOpenError(true);
        setError("Max retries reached. Upload failed.");
        throw new Error("Max retries reached. Upload failed.");
        }
        // Wait for a short time before retrying
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  };


const createNFT = async (
  name,
  image,
  description,
  router,
  category,
  swapCategories
) => {
  if (!name || !description || !image || !category) {
    setOpenError(true),
    setError("Data is missing!");
    return;
  }

  const data = JSON.stringify({
    name,
    description,
    image,
    category,
    swapCategories,
  });

  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        },
      }
    );

    const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    console.log("IPFS URL:", url);

    let contract;
    try {
      contract = await connectSmartContract();
    } catch (connectionError) {
      console.error("Error connecting to smart contract:", connectionError);
      setOpenError(true);
      return;
    }

    if (!contract) {
      console.error("Contract is undefined.");
      setOpenError(true);
      return;
    }

    console.log("Contract:", contract);
    console.log("Attempting to create token with URL:", url);

    const transaction = await contract.createToken(url);
    console.log("Transaction:", transaction);

    await transaction.wait(); // Wait for the transaction to be mined
    router.push("/searchPage");
  } catch (error) {
    console.error("Error creating NFT:", error);
    setOpenError(true);
  }
};

  const createBarterListing = async (tokenId, durationInDays) => {
    try {
      const contract = await connectSmartContract();
      const transaction = await contract.createBarterListing(
        tokenId,
        durationInDays
      );
      await transaction.wait();
    } catch (error) {
      setOpenError(true), setError("Error creating barter listing !!!");
    }
  };

  const makeBarterOffer = async (listingId, offeredTokenId) => {
    try {
      const contract = await connectSmartContract();
      const transaction = await contract.makeBarterOffer(
        listingId,
        offeredTokenId
      );
      await transaction.wait();
    } catch (error) {
      setOpenError(true), setError("Error making barter offer !!!");
    }
  };

  const acceptBarterOffer = async (listingId, offeredTokenId) => {
    try {
      const contract = await connectSmartContract();
      const transaction = await contract.acceptBarterOffer(
        listingId,
        offeredTokenId
      );
      await transaction.wait();
    } catch (error) {
      setOpenError(true), setError("Error accepting barter offer !!!");
    }
  };

  const cancelBarterListing = async (listingId) => {
    try {
      const contract = await connectSmartContract();
      const transaction = await contract.cancelBarterListing(listingId);
      await transaction.wait();
    } catch (error) {
      setOpenError(true), setError("Error cancelling barter listing !!!");
    }
  };

  const relistNFT = async (tokenId, durationInDays) => {
    try {
      const contract = await connectSmartContract();
      const transaction = await contract.relistNFT(tokenId, durationInDays);
      await transaction.wait();
    } catch (error) {
      setOpenError(true), setError("Error relisting NFT !!!");
    }
  };


  const fetchNFTs = async () => {
    try {
      const contract = await connectSmartContract();
      console.log("Contract connected successfully");
      const data = await contract.fetchAllListings();
      console.log("Fetched listings data:", data);
      if (!Array.isArray(data) || data.length === 0) {
        console.log("No listings found or data is not in expected format");
        return [];
      }

      console.log(`Processing ${data.length} listings...`);
      const items = await Promise.all(
        data.map(async (i, index) => {
          try {
            console.log(`Processing listing ${index + 1}/${data.length}`);
            console.log("Listing data:", i);

            const tokenURI = await contract.tokenURI(i.tokenId);
            console.log(`TokenURI for tokenId ${i.tokenId}:`, tokenURI);

            const meta = await axios.get(tokenURI);
            console.log(`Metadata for tokenId ${i.tokenId}:`, meta.data);

            let item = {
              listingId: i.listingId.toNumber(),
              tokenId: i.tokenId.toNumber(),
              owner: i.owner,
              expirationTime: i.expirationTime.toNumber(),
              isActive: i.isActive,
              name: meta.data.name,
              description: meta.data.description,
              image: meta.data.image,
            };
            console.log("Processed NFT:", item);
            return item;
          } catch (error) {
            console.error(`Error processing listing ${index + 1}:`, error);
            return null;
          }
        })
      );

      const validItems = items.filter((item) => item !== null);
      console.log("Total valid NFTs processed:", validItems.length);
      return validItems;
    } catch (error) {
      console.error("Error in fetchNFTs:", error);
      throw error;
    }
  };

  const fetchMyListings = async () => {
    try {
      const contract = await connectSmartContract();
      const data = await contract.fetchMyListings();
      const items = await Promise.all(
        data.map(async (i) => {
          const tokenURI = await contract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenURI);
          let item = {
            listingId: i.listingId.toNumber(),
            tokenId: i.tokenId.toNumber(),
            owner: i.owner,
            expirationTime: i.expirationTime.toNumber(),
            isActive: i.isActive,
            name: meta.data.name,
            description: meta.data.description,
            image: meta.data.image,
          };
          return item;
        })
      );
      return items;
    } catch (error) {
      setOpenError(true), setError("Error fetching my listings !!!");
    }
  };

  const fetchMyNFTs = async () => {
    try {
      const contract = await connectSmartContract();
      const data = await contract.fetchMyNFTs();
      const items = await Promise.all(
        data.map(async (tokenId) => {
          const tokenURI = await contract.tokenURI(tokenId);
          const meta = await axios.get(tokenURI);
          let item = {
            tokenId: tokenId.toNumber(),
            owner: await contract.ownerOf(tokenId),
            name: meta.data.name,
            description: meta.data.description,
            image: meta.data.image,
          };
          return item;
        })
      );
      return items;
    } catch (error) {
      setOpenError(true), setError("Error fetching my NFTs !!!");
    }
  };

  const getBarterOffers = async (listingId) => {
    try {
      const contract = await connectSmartContract();
      const offers = await contract.getBarterOffers(listingId);
      const items = await Promise.all(
        offers.map(async (offer) => {
          const tokenURI = await contract.tokenURI(offer.offeredTokenId);
          const meta = await axios.get(tokenURI);
          return {
            offeredTokenId: offer.offeredTokenId.toNumber(),
            offerer: offer.offerer,
            isAccepted: offer.isAccepted,
            name: meta.data.name,
            description: meta.data.description,
            image: meta.data.image,
          };
        })
      );
      return items;
    } catch (error) {
      setOpenError(true), setError("Error fetching barter offers !!!");
    }
  };

  // const fetchNFTs = async () => {
  //   try {
  //     const web3Modal = new Web3Modal();
  //     const connection = await web3Modal.connect();

  //     if (!connection) {
  //       console.error("No connection established");
  //       return;
  //     }

  //     const provider = new ethers.BrowserProvider(connection);
  //     console.log("Provider created:", provider);

  //     if (!provider) {
  //       console.error("Provider not initialized");
  //       return;
  //     }

  //     const contract = fetchContract(provider);

  //     if (!contract) {
  //       console.error("Contract not initialized");
  //       return;
  //     }

  //     const data = await contract.fetchMarketItems();

  //     const items = await Promise.all(
  //       data.map(async ({ tokenId, seller, owner }) => {
  //         const tokenURI = await contract.tokenURI(tokenId);
  //         const {
  //           data: { image, name, description },
  //         } = await axios.get(tokenURI);

  //         return {
  //           tokenId: tokenId.toNumber(),
  //           seller,
  //           owner,
  //           image,
  //           name,
  //           description,
  //           tokenURI,
  //         };
  //       })
  //     );

  //     return items;
  //   } catch (error) {
  //     console.error("Error fetching NFTs !!!");
  //   }
  // };

  // useEffect(() => {
  //   fetchNFTs();
  // }, []);

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
      setOpenError(true), setError("Error fetching listed NFTs !!!");
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
      setOpenError(true), setError("Error buying NFT !!!");
    }
  };

  const listForBarter = async (tokenId, desiredTokenId) => {
    try {
      const contract = await connectSmartContract();
      const transaction = await contract.listForBarter(tokenId, desiredTokenId);
      await transaction.wait();
    } catch (error) {
      setOpenError(true), setError("Error listing for barter !!!");
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
      setOpenError(true), setError("Error accepting barter trade !!!");
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
      setOpenError(true), setError("Error fetching barter items !!!");
    }
  };

  return (
    <NFTMarketplaceContext.Provider
      value={{
        checkWalletConnection,
        connectWallet,
        uploadToIPFS,
        createNFT,
        createBarterListing,
        makeBarterOffer,
        acceptBarterOffer,
        cancelBarterListing,
        relistNFT,
        fetchNFTs,
        fetchMyNFTsOrListedNFTs,
        buyNFT,
        currentAccount,
        titleData,
        titleCover,
        // fetchAllListings,
        fetchMyNFTs,
        fetchMyListings,
        getBarterOffers,
        listForBarter,
        acceptBarterTrade,
        fetchBarterItems,
        error,
        openError,
        setOpenError,
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};

