import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

import { NFTMarketplaceAddress, NFTMarketplaceABI } from "./constants";

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

  const accountsMappingRef = useRef({});
  const [currentAccount, setCurrentAccount] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const [openError, setOpenError] = useState(false);

  const router = useRouter();
  useEffect(() => {
    // Load accounts mapping from localStorage when component mounts
    const storedMapping = localStorage.getItem("accountsMapping");
    if (storedMapping) {
      accountsMappingRef.current = JSON.parse(storedMapping);
    }

    // // Uncomment the following line to reset accountsMapping in localStorage to an empty object
    // accountsMappingRef.current = {};
    // localStorage.setItem('accountsMapping', JSON.stringify(accountsMappingRef.current));
  }, []);

  const saveAccountsMapping = () => {
    localStorage.setItem(
      "accountsMapping",
      JSON.stringify(accountsMappingRef.current)
    );
  };

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
      setOpenError(true);
      setError("Error connecting to Smart Contract!!!");
    }
  };

const checkWalletConnection = async (forceOpen = false) => {
  try {
    if (!window.ethereum) {
      setError("Please install MetaMask to connect your wallet.");
      setOpenError(true);
      window.open("https://metamask.io/download.html", "_blank");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    console.log("Connected accounts:", accounts);

    if (accounts.length > 0) {
      // Update accountsMapping only for new accounts
      accounts.forEach((account, index) => {
        const lowerCaseAccount = account.toLowerCase();
        if (!accountsMappingRef.current[lowerCaseAccount]) {
          accountsMappingRef.current[lowerCaseAccount] = `${
            Object.keys(accountsMappingRef.current).length + 1
          }`;
        }
      });

      saveAccountsMapping(); // Save the updated mapping to localStorage

      console.log("Current accounts mapping:", accountsMappingRef.current);

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const activeAddress = (await signer.getAddress()).toLowerCase();

        console.log("Active signer address:", activeAddress);

        if (accountsMappingRef.current[activeAddress]) {
          const newCurrentAccount = {
            address: activeAddress,
            userId: accountsMappingRef.current[activeAddress],
          };
          setCurrentAccount(newCurrentAccount);
          setUserId(newCurrentAccount.userId);
          console.log("Current account:", newCurrentAccount);
          return newCurrentAccount;
        } else {
          const newUserId = `user${
            Object.keys(accountsMappingRef.current).length + 1
          }`;
          accountsMappingRef.current[activeAddress] = newUserId;
          saveAccountsMapping(); // Save the updated mapping to localStorage
          const newCurrentAccount = {
            address: activeAddress,
            userId: newUserId,
          };
          setCurrentAccount(newCurrentAccount);
          console.log("Current account:", newCurrentAccount);
          return newCurrentAccount;
        }
      } catch (error) {
        console.error("Error fetching active signer:", error);
      }
    } else if (forceOpen) {
      console.log("No accounts found. Attempting to open MetaMask for login.");
      try {
        // Attempt to request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });
        // If successful, recursively call checkWalletConnection
        return checkWalletConnection(false);
      } catch (error) {
        if (error.code === 4001) {
          // User rejected the request
          console.log("User rejected the connect request");
          setError("Connection request was rejected. Please try again.");
        } else if (error.code === -32002) {
          // MetaMask is already processing a connect request
          console.log(
            "MetaMask is already open. Attempting to focus the MetaMask window."
          );

          // Attempt to focus the MetaMask popup
          if (window.ethereum.isMetaMask) {
            window.ethereum
              .request({
                method: "wallet_requestPermissions",
                params: [{ eth_accounts: {} }],
              })
              .catch(console.log); // This might bring MetaMask to the foreground
          }

          setError(
            "MetaMask is already open. Please check your MetaMask extension and approve the connection."
          );
        } else {
          console.error("Error requesting accounts:", error);
          setError("An error occurred while connecting. Please try again.");
        }
        setOpenError(true);
        setCurrentAccount(null);
        return null;
      }
    } else {
      console.log("No accounts found and not forcing open.");
      setCurrentAccount(null);
      return null;
    }
  } catch (error) {
    console.error("Error in checkWalletConnection:", error);
    setOpenError(true);
    setError("Error while connecting to wallet. Please try again.");
    return null;
  }
};

useEffect(() => {
  const initializeWallet = async () => {
    const account = await checkWalletConnection();
    if (account) {
      setUserId(account.userId);
    } else {
      setUserId(null);
    }
  };

  initializeWallet();

  // Set up event listener for account changes
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", async () => {
      const account = await checkWalletConnection();
      if (account) {
        setUserId(account.userId);
      } else {
        setUserId(null);
      }
    });
  }

  // Cleanup function
  return () => {
    if (window.ethereum) {
      window.ethereum.removeListener(
        "accountsChanged",
        checkWalletConnection
      );
    }
  };
}, []);

const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      window.open("https://metamask.io/download.html", "_blank");
      return console.log("Please install MetaMask");
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAccount(accounts[0]);
  } catch (error) {
    setOpenError(true);
    setError("Error while connecting to wallet!!!");
  }
};

  const disconnectWallet = async () => {
    setCurrentAccount("");
    
    console.log("logoff successfully");
    
    // Redirect to home page or login page
    router.push("/");
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
          throw new Error("Max retries reached. Upload to IPFS failed.");
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
      setOpenError(true), setError("Data is missing!");
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

      // const transaction = await contract.createToken(url);
      // console.log("Transaction:", transaction);

      const transaction = await contract.createTokenAndList(url);
      console.log("Transaction:", transaction);

      await transaction.wait(); // Wait for the transaction to be mined
      router.push("/searchPage");
    } catch (error) {
      console.error("Error creating NFT:", error);
      setOpenError(true);
    }
  };

  // ---- FetchNFTs ----
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

            // if tokenId is a BigNumber and convert it to a regular number
            const tokenId = i.tokenId.toNumber
              ? i.tokenId.toNumber()
              : Number(i.tokenId);

            const tokenURI = await contract.tokenURI(tokenId);
            console.log(`TokenURI for tokenId ${tokenId}:`, tokenURI);

            const meta = await axios.get(tokenURI);
            console.log(`Metadata for tokenId ${tokenId}:`, meta.data);

            // Retrieve the creatorId from the accountsMappingRef based on the itemOwner
            const normalizedOwner = i.itemOwner.toLowerCase();
            const creatorId = accountsMappingRef.current[normalizedOwner] || 0;

            const randomLikes = Math.floor(Math.random() * 501);

            let item = {
              listingId: i.listingId.toNumber
                ? i.listingId.toNumber()
                : Number(i.listingId),
              tokenId: tokenId,
              expirationTime: i.expirationTime.toNumber
                ? i.expirationTime.toNumber()
                : Number(i.expirationTime),
              isActive: i.isActive,
              name: meta.data.name,
              creatorId: creatorId,
              contractOwner: contract.target,
              // userId: currentAccount.userId ? currentAccount.userId : 1,
              itemOwner: i.itemOwner,
              likes: randomLikes,
              description: meta.data.description,
              image: meta.data.image,
              Category: meta.data.category,
              swapCategory: meta.data.swapCategories,
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

          // Retrieve the creatorId from the accountsMappingRef based on the itemOwner
          const normalizedOwner = i.itemOwner.toLowerCase();
          const creatorId = accountsMappingRef.current[normalizedOwner] || 0;

          let item = {
            listingId: i.listingId.toNumber(),
            tokenId: i.tokenId.toNumber(),
            creatorId: creatorId,
            owner: i.itemOwner,
            itemOwner: i.itemOwner,
            expirationTime: i.expirationTime.toNumber(),
            isActive: i.isActive,
            name: meta.data.name,
            description: meta.data.description,
            likes: randomLikes,
            image: meta.data.image,
            Category: meta.data.Category,
            swapCategory: meta.data.swapCategories,
          };
          return item;
        })
      );
      return items;
    } catch (error) {
      setOpenError(true), setError("Error fetching my listings !!!");
    }
  };

  const fetchMyNFTs = async (walletAddress) => {
    try {
      const contract = await connectSmartContract();
      console.log("Contract connected successfully");
      const data = await contract.fetchMyNFTs(walletAddress);
      console.log("Fetched MyNFTs data:", data);

      if (!Array.isArray(data) || data.length === 0) {
        console.log("No NFTs found or data is not in expected format");
        return [];
      }

      console.log(`Processing ${data.length} NFTs...`);
      const items = await Promise.all(
        data.map(async (tokenId, index) => {
          try {
            console.log(`Processing NFT ${index + 1}/${data.length}`);
            console.log("Token ID:", tokenId);

            // Convert tokenId to a regular number if it's a BigNumber
            const normalizedTokenId = tokenId.toNumber
              ? tokenId.toNumber()
              : Number(tokenId);

            const tokenURI = await contract.tokenURI(normalizedTokenId);
            console.log(`TokenURI for tokenId ${normalizedTokenId}:`, tokenURI);

            const meta = await axios.get(tokenURI);
            console.log(`Metadata for tokenId ${normalizedTokenId}:`, meta.data);

            const itemOwner = await contract.ownerOf(normalizedTokenId);
            const normalizedOwner = itemOwner.toLowerCase();
            const normalizedWalletAddress = walletAddress.toLowerCase();

            // Filter out NFTs that do not match the passed walletAddress
            if (normalizedOwner !== normalizedWalletAddress) {
              console.log(`Skipping NFT ${normalizedTokenId} as it does not belong to the wallet address ${walletAddress}`);
              return null;
            }

            const creatorId =
              accountsMappingRef.current[normalizedOwner] || 0;

            const randomLikes = Math.floor(Math.random() * 501);

            let item = {
              tokenId: normalizedTokenId,
              owner: itemOwner,
              creatorId: creatorId,
              contractOwner: contract.target,
              itemOwner: itemOwner,
              likes: randomLikes,
              name: meta.data.name,
              description: meta.data.description,
              image: meta.data.image,
              image: meta.data.image,
              Category: meta.data.category,
              swapCategory: meta.data.swapCategories,
            };
            console.log("MY NFTs:", item);
            return item;
          } catch (error) {
            console.error(`Error processing NFT ${index + 1}:`, error);
            return null;
          }
        })
      );
      
      const validItems = items.filter((item) => item !== null);
      console.log("Total valid NFTs processed:", validItems.length);
      return validItems;
    } catch (error) {
      console.error("Error in fetchMyNFTs:", error);
      throw error;
    }
  };
  
const fetchNFTByListingId = async (listingId) => {
  try {
    const contract = await connectSmartContract();
    console.log("Contract connected successfully");

    if (!listingId) {
      throw new Error("Invalid listing ID");
    }

    // Ensure listingId is a number
    const parsedListingId = parseInt(listingId);
    console.log("parsedListingId: ", parsedListingId);
    const data = await contract.fetchNFTByListingId(parsedListingId);
    console.log("Fetched NFT by ListingId:", data);

    if (!data) {
      console.log("No data found for the given listing ID");
      return null;
    }

    const [listing, tokenURI, owner] = data;
    const meta = await axios.get(tokenURI);
    console.log(`Metadata for listing ID ${listingId}:`, meta.data);

    const creatorId = accountsMappingRef.current[owner.toLowerCase()] || 0;
    const randomLikes = Math.floor(Math.random() * 501);

    const item = {
      tokenId: listing.tokenId,
      owner: owner,
      creatorId: creatorId,
      contractOwner: contract.target,
      itemOwner: owner,
      likes: randomLikes,
      name: meta.data.name,
      description: meta.data.description,
      image: meta.data.image,
      category: meta.data.category,
      swapCategory: meta.data.swapCategories,
    };

    console.log("NFT Details:", item);
    return item;
  } catch (error) {
    console.error("Error fetching NFT by Listing ID:", error);
    return null;
  }
};

const fetchNFTByOfferId = async (offerId) => {
  try {
    const contract = await connectSmartContract();
    console.log("Contract connected successfully");

    if (!offerId) {
      throw new Error("Invalid offer ID");
    }

    // Ensure offerId is a number
    const parsedOfferId = parseInt(offerId);
    console.log("parsedOfferId: ", parsedOfferId);
    // const data = await contract.fetchNFTByOfferId(parsedOfferId);
    // const data = await contract.fetchNFTByOfferId("19n");
    if (isNaN(parsedOfferId)) {
      throw new Error("Offer ID must be a valid number");
    }
    console.log("Parsed Offer ID:", parsedOfferId);

    // Fetch data from the smart contract
    const data = await contract.fetchNFTByOfferId(parsedOfferId);
    console.log("Fetched NFT by OfferId:", data);


    if (!data) {
      console.log("No data found for the given offer ID");
      return null;
    }

    const [offer, tokenURI, owner] = data;
    const meta = await axios.get(tokenURI);
    console.log(`Metadata for offer ID ${offerId}:`, meta.data);

    const creatorId = accountsMappingRef.current[owner.toLowerCase()] || 0;
    const randomLikes = Math.floor(Math.random() * 501);

    const item = {
      tokenId: offer.offerTokenId,
      owner: owner,
      creatorId: creatorId,
      contractOwner: contract.target,
      itemOwner: owner,
      likes: randomLikes,
      name: meta.data.name,
      description: meta.data.description,
      image: meta.data.image,
      category: meta.data.category,
      swapCategory: meta.data.swapCategories,
    };

    console.log("NFT Details:", item);
    return item;
  } catch (error) {
    console.error("Error fetching NFT by Offer ID:", error);
    return null;
  }
};


//  const fetchAvailableNFTsForBarter = async (walletAddress) => {

//  };

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

const createBarterOffer = async (listingId) => {
  try {
    const contract = await connectSmartContract();

    // Create the barter offer on the contract
    const transaction = await contract.createBarterOffer(listingId);
    console.log("Transaction hash:", transaction.hash);
    
    const receipt = await transaction.wait();
    console.log("Transaction receipt:", receipt);

    if (receipt.status === 0) {
      throw new Error("Transaction failed");
    }

    // Check for events in both receipt.events and receipt.logs
    let offerCreatedEvent = receipt.events?.find(
      (event) => event.event === "BarterOfferCreated"
    );

    if (!offerCreatedEvent) {
      offerCreatedEvent = receipt.logs?.find(
        (log) => log.eventName === "BarterOfferCreated"
      );
    }

    if (!offerCreatedEvent) {
      throw new Error(
        "BarterOfferCreated event not found in the transaction receipt"
      );
    }

    // const offerId = offerCreatedEvent.args.offerId;

    // Extract the offerId from the event arguments
    const offerIdBigInt = offerCreatedEvent.args.offerId;

    // Convert BigInt to a string for safe display or further usage
    const offerId = offerIdBigInt.toString();

    console.log("Barter offer created successfully with offerId:", offerId);
    return offerId;
  } catch (error) {
    console.error("Error creating barter offer:", error);
    setOpenError(true);
    setError(`Error creating barter offer: ${error.message}`);
    return null;
  }
};


  const acceptBarterOffer = async (listingId, offerId) => {
    try {
      const contract = await connectSmartContract();
      const transaction = await contract.acceptBarterOffer(listingId, offerId);
      await transaction.wait();
      console.log("Barter offer accepted successfully");
    } catch (error) {
      console.error("Error accepting barter offer:", error);
      setOpenError(true);
      setError("Error accepting barter offer");
    }
  };

  const confirmBarterTransaction = async (transactionId) => {
    try {
      const contract = await connectSmartContract();
      const transaction = await contract.confirmBarterTransaction(
        transactionId
      );
      await transaction.wait();
      console.log("Barter transaction confirmed successfully");
    } catch (error) {
      console.error("Error confirming barter transaction:", error);
      setOpenError(true);
      setError("Error confirming barter transaction");
    }
  };

  const cancelBarterTransaction = async (transactionId) => {
    try {
      const contract = await connectSmartContract();
      const transaction = await contract.cancelBarterTransaction(transactionId);
      await transaction.wait();
      console.log("Barter transaction cancelled successfully");
    } catch (error) {
      console.error("Error cancelling barter transaction:", error);
      setOpenError(true);
      setError("Error cancelling barter transaction");
    }
  };

  const fetchMyTransactions = async () => {
    try {
      const contract = await connectSmartContract();
      const transactions = await contract.fetchMyTransactions();
      const items = await Promise.all(
        transactions.map(async (t) => {
          return {
            transactionId: t.transactionId.toNumber(),
            listingId: t.listingId.toNumber(),
            offerId: t.offerId.toNumber(),
            lister: t.lister,
            offerer: t.offerer,
            listerTokenId: t.listerTokenId.toNumber(),
            offererTokenId: t.offererTokenId.toNumber(),
            timestamp: new Date(t.timestamp.toNumber() * 1000).toLocaleString(),
            status: ["Pending", "Accepted", "Completed", "Cancelled"][t.status],
          };
        })
      );
      return items;
    } catch (error) {
      console.error("Error fetching my transactions:", error);
      setOpenError(true);
      setError("Error fetching my transactions");
    }
  };

  return (
    <NFTMarketplaceContext.Provider
      value={{
        titleData,
        titleCover,
        accountsMappingRef,
        currentAccount,
        error,
        openError,
        setOpenError,
        checkWalletConnection,
        connectWallet,
        disconnectWallet,
        uploadToIPFS,
        createNFT,
        fetchNFTs,
        fetchMyListings,
        fetchNFTByListingId,
        fetchNFTByOfferId,
        fetchMyNFTs,
        // fetchAvailableNFTsForBarter,
        getBarterOffers,
        createBarterOffer,
        acceptBarterOffer,
        confirmBarterTransaction,
        cancelBarterTransaction,
        fetchMyTransactions,
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};
