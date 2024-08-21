import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import { create as ipfsHttpClient } from "ipfs-http-client";
const axios = require("axios");
const FormData = require("form-data");
require('dotenv').config();


import { NFTMarketplaceAddress, NFTMarketplaceABI } from "./constants";

const fetchContract = (signerOrProvider) => {
  console.log("NFTMarketplaceAddress:", NFTMarketplaceAddress);

  return new ethers.Contract(
    NFTMarketplaceAddress,
    NFTMarketplaceABI,
    signerOrProvider
  )
};

  
export const NFTMarketplaceContext = React.createContext();



export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = "Barter Easy";
  const titleCover =
  "Barter Easy is a platform that simplifies bartering through smart contracts. By using blockchain, it ensures secure, transparent, and automated trades without intermediaries. Whether for digital or physical items, Barter Easy offers a user-friendly interface for seamless and trustworthy transactions.";
  
  const [currentAccount, setCurrentAccount] = useState("");
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
          console.log("Error connecting to Smart Contract:", error);
      }
  };

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
      console.log(currentAccount);
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

  // const uploadToIPFS = async (file) => {
  //   try {
  //     const added = await client.add({ content: file });
  //     const url = `${subdomain}/ipfs/${added.path}`;
  //     return url;
  //   } catch (error) {
  //     console.log("Error uploading to IPFS:", error);
  //   }
  // };


// const pinata_api_key = process.env.PINATA_API_KEY;
// const pinata_secret_key = process.env.PINATA_SECRET_KEY;

const uploadToIPFS = async (file) => {
  if (!file) {
    console.error("No file provided for upload");
    throw new Error("No file provided");
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
        throw new Error("Max retries reached. Upload failed.");
      }
      // Wait for a short time before retrying
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
};


  // // const createSale = async (url, formInputPrice, isReselling, id) => {
  // //   try {
  // //     const contract = await connectSmartContract();
  // //     const price = ethers.utils.parseUnits(formInputPrice, "ether");

  // //     const transaction = !isReselling
  // //       ? await contract.createToken(url, price, {
  // //           value: listingPrice,
  // //         })
  // //       : await contract.resellToken(id, price, {
  // //           value: listingPrice,
  // //         });

  // //     await transaction.wait();
  // //   } catch (error) {
  // //     console.log("Error creating sale:", error);
  // //   }
  // // };



 const createNFT = async (name, image, description, router) => {
   if (!name || !description || !image) {
     console.log("Data is Missing !!");
     setOpenError(true);
     return;
   }

   const data = JSON.stringify({ name, description, image });

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

      // Connect to the smart contract
      let contract;
      try {
          contract = await connectSmartContract();
      } catch (connectionError) {
          console.error("Error connecting to smart contract:", connectionError);
          setOpenError(true);
          return;
      }

      // Ensure contract is defined before calling createToken
      if (!contract) {
          console.error("Contract is undefined.");
          setOpenError(true);
          return;
      }

      console.log("Contract:", contract);

      // Attempt to create the token
      console.log("Attempting to create token with URL:", url);
      const transaction = await contract.createToken(url);
      console.log("Transaction:", transaction);
      
      router.push("/searchPage");
  } catch (error) {
      console.error("Error creating NFT:", error);
      setOpenError(true);
    }
};

    const createBarterListing = async (tokenId, durationInDays) => {
    try {
      const contract = await connectSmartContract();
      const transaction = await contract.createBarterListing(tokenId, durationInDays);
      await transaction.wait();
    } catch (error) {
      console.log("Error creating barter listing:", error);
    }
  };

  const makeBarterOffer = async (listingId, offeredTokenId) => {
    try {
      const contract = await connectSmartContract();
      const transaction = await contract.makeBarterOffer(listingId, offeredTokenId);
      await transaction.wait();
    } catch (error) {
      console.log("Error making barter offer:", error);
    }
  };

  const acceptBarterOffer = async (listingId, offeredTokenId) => {
    try {
      const contract = await connectSmartContract();
      const transaction = await contract.acceptBarterOffer(listingId, offeredTokenId);
      await transaction.wait();
    } catch (error) {
      console.log("Error accepting barter offer:", error);
    }
  };

  const cancelBarterListing = async (listingId) => {
    try {
      const contract = await connectSmartContract();
      const transaction = await contract.cancelBarterListing(listingId);
      await transaction.wait();
    } catch (error) {
      console.log("Error cancelling barter listing:", error);
    }
  };

  const relistNFT = async (tokenId, durationInDays) => {
    try {
      const contract = await connectSmartContract();
      const transaction = await contract.relistNFT(tokenId, durationInDays);
      await transaction.wait();
    } catch (error) {
      console.log("Error relisting NFT:", error);
    }
  };

  const fetchNFTs = async () => {
    try {
      const contract = await connectSmartContract();
      const data = await contract.fetchAllListings();
      const items = await Promise.all(data.map(async (i) => {
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
      }));
      return items;
    } catch (error) {
      console.log("Error fetching all listings:", error);
    }
  };

    const fetchMyListings = async () => {
    try {
      const contract = await connectSmartContract();
      const data = await contract.fetchMyListings();
      const items = await Promise.all(data.map(async (i) => {
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
      }));
      return items;
    } catch (error) {
      console.log("Error fetching my listings:", error);
    }
  };

  const fetchMyNFTs = async () => {
    try {
      const contract = await connectSmartContract();
      const data = await contract.fetchMyNFTs();
      const items = await Promise.all(data.map(async (tokenId) => {
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
      }));
      return items;
    } catch (error) {
      console.log("Error fetching my NFTs:", error);
    }
  };

  const getBarterOffers = async (listingId) => {
    try {
      const contract = await connectSmartContract();
      const offers = await contract.getBarterOffers(listingId);
      const items = await Promise.all(offers.map(async (offer) => {
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
      }));
      return items;
    } catch (error) {
      console.log("Error fetching barter offers:", error);
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
//     console.error("Error fetching NFTs:", error);
//   }
// };

  useEffect(() => {
    fetchNFTs();
  }, []);

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
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};

// export const useNFTMarketplace = () => React.useContext(NFTMarketplaceContext);
