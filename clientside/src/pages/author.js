import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Style from "../styles/author.module.css";
import {
  AuthorProfileCard,
  AuthorTabs,
  AuthorNFTCard,
} from "./AuthorPage/compIndex";
import images from "../assets/img";
import { Banner, NFTCard, Title, Loader } from "../components/componentsIndex";
import { NFTMarketplaceContext } from "../../SmartContract/Context/NFTMarketplaceContext";

const Author = () => {
  const router = useRouter();
  const { tab } = router.query;

  const [activeTab, setActiveTab] = useState("collectables");
  const { fetchNFTs, fetchMyNFTs, currentAccount } = useContext(
    NFTMarketplaceContext
  );
  const [nfts, setNfts] = useState([]);
  const [myNFTs, setMyNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  // Fetch all NFTs when the component mounts
  useEffect(() => {
    const fetchAllNFTs = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching NFTs...");
        const fetchedNFTs = await fetchNFTs();
        console.log("Fetched NFTs:", fetchedNFTs);
        setNfts(fetchedNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        setError(
          "Failed to fetch NFTs. Please check the console for more details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllNFTs();
  }, [fetchNFTs]);

  // Fetch user's NFTs when the component mounts
  useEffect(() => {
    const fetchUserNFTs = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching My NFTs...");
        const fetchedMyNFTs = await fetchMyNFTs();
        console.log("Fetched My NFTs:", fetchedMyNFTs);
        setMyNFTs(fetchedMyNFTs);
      } catch (error) {
        console.error("Error fetching My NFTs:", error);
        setError(
          "Failed to fetch My NFTs. Please check the console for more details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserNFTs();
  }, [fetchMyNFTs]);

  return (
    <div className={Style.Author}>
      <Banner bannerImage={images.creatorbackground11} />
      <AuthorProfileCard />
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
