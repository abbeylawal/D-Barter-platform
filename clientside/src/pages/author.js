import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Style from "../styles/author.module.css";
import {
  AuthorProfileCard,
  AuthorTabs,
  AuthorNFTCard,
} from "./AuthorPage/compIndex";
import images from "../assets/img";
import { Banner, Loader } from "../components/componentsIndex";
import { NFTMarketplaceContext } from "../../SmartContract/Context/NFTMarketplaceContext";

const Author = ({
  walletAddress: propWalletAddress,
  creatorId: propCreatorId,
}) => {
  const router = useRouter();
  const {
    tab,
    walletAddress: queryWalletAddress,
    creatorId: queryCreatorId,
  } = router.query;

  const walletAddress = propWalletAddress || queryWalletAddress;
  const creatorId = propCreatorId || queryCreatorId;

  const [activeTab, setActiveTab] = useState(tab || "collectables");
  const {
    fetchNFTs,
    fetchMyNFTs,
    getBarterOffers,
    currentAccount,
    checkWalletConnection,
  } = useContext(NFTMarketplaceContext);

  const [nfts, setNfts] = useState([]);
  const [myNFTs, setMyNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch NFTs and check for pending offers
  const fetchAllNFTs = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "owned" && walletAddress) {
        console.log("Fetching My NFTs...");
        const fetchedMyNFTs = await fetchMyNFTs(walletAddress);

        // Check if any NFTs have pending offers
        const nftsWithPendingOffers = await Promise.all(
          fetchedMyNFTs.map(async (nft) => {
            const offers = await getBarterOffers(nft.tokenId);

            // Check for pending offers locked by escrow
            const hasPendingOffer = offers.some(
              (offer) =>
                offer.isActive &&
                offer.offerer.toLowerCase() ===
                  currentAccount?.address.toLowerCase()
            );

            return { ...nft, hasPendingOffer };
          })
        );
        setMyNFTs(nftsWithPendingOffers);
      } else if (activeTab === "collectables") {
        console.log("Fetching NFTs...");
        const fetchedNFTs = await fetchNFTs();
        setNfts(fetchedNFTs);
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab} NFTs:`, error);
      setError(
        `Failed to fetch ${activeTab} NFTs. Please check the console for more details.`
      );
    } finally {
      setLoading(false);
    }
  };

  // Ensure wallet connection is established and redirect if wallet changes
  useEffect(() => {
    const ensureWalletConnection = async () => {
      if (!currentAccount) {
        await checkWalletConnection();
      } else if (
        walletAddress &&
        currentAccount.address.toLowerCase() !== walletAddress.toLowerCase()
      ) {
        // Redirect to the correct page with updated walletAddress if necessary
        router.push({
          pathname: "/author",
          query: {
            tab: activeTab,
            walletAddress: currentAccount.address,
          },
        });
      } else {
        // Fetch NFTs if the wallet is connected and no redirection is needed
        fetchAllNFTs();
      }
    };

    ensureWalletConnection();
  }, [currentAccount, walletAddress, checkWalletConnection, activeTab, router]);

  // Set the active tab when the tab query changes
  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  return (
    <div className={Style.Author}>
      <Banner
        bannerImage={
          creatorId ? images.creatorbackground11 : images.creatorbackground9
        }
      />
      <AuthorProfileCard creatorId={creatorId} walletAddress={walletAddress} />
      <AuthorTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {loading ? (
        <Loader />
      ) : (
        <AuthorNFTCard
          collectables={activeTab === "collectables"}
          owned={activeTab === "owned"}
          listed={activeTab === "listed"}
          liked={activeTab === "liked"}
          nfts={nfts}
          myNFTs={myNFTs}
        />
      )}
    </div>
  );
};

export default Author;
