import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { TiTick } from "react-icons/ti";
import { Title, Button, Loader, Error } from "../components/componentsIndex";
import { NFTMarketplaceContext } from "../../SmartContract/Context/NFTMarketplaceContext";
import Styles from "../styles/OfferPage.module.css";
import FormStyle from "../pages/UploadProduct/UploadForm.module.css";

const OfferPage = ({
  offerAddress: propOfferAddress,
  creatorId: propCreatorId,
  listingId: propListingId,
  nftName: propNftName,
}) => {
  const router = useRouter();
  const {
    offerAddress: queryWalletAddress,
    itemCreatorId: queryCreatorId,
    listingId: queryListingId,
    nftName: queryNftName,
  } = router.query;

  const offerAddress = propOfferAddress || queryWalletAddress;
  const creatorId = propCreatorId || queryCreatorId;
  const listingId = propListingId || queryListingId;
  const nftName = propNftName || queryNftName;

  const [userNFTs, setUserNFTs] = useState([]);
  const [selectedNFTs, setSelectedNFTs] = useState([]);
  const [durationInHours, setDurationInHours] = useState(24);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const { fetchMyNFTs, createBarterOffer } = useContext(NFTMarketplaceContext);

useEffect(() => {
  const fetchUserNFTs = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching My NFTs...");
      const fetchedMyNFTs = offerAddress
        ? await fetchMyNFTs(offerAddress)
        : await fetchMyNFTs();

      // Filter out the NFTs that are locked
      const unlockedNFTs = fetchedMyNFTs.filter(
        (nft) => nft.lockStatus !== "Locked"
      );

      console.log("Fetched My NFTs (Unlocked only):", unlockedNFTs);
      setUserNFTs(unlockedNFTs);
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
}, [fetchMyNFTs, offerAddress]);


  const handleNFTSelection = (tokenId ) => {
    setSelectedNFTs((prevSelectedNFTs) => {
      if (prevSelectedNFTs.includes(tokenId )) {
        return prevSelectedNFTs.filter((id) => id !== tokenId );
      } else if (prevSelectedNFTs.length < 2) {
        return [...prevSelectedNFTs, tokenId ];
      } else {
        return prevSelectedNFTs;
      }
    });
  };

  const handleSubmitOffer = async () => {
    if (selectedNFTs.length === 0) {
      setError("Please select at least one NFT");
      setTimeout(() => {
        setError(null);
      }, 2000);

      return;
    }

    setLoading(true);
    setError(null);

    try {
      const offerIds = [];
      console.log("selectedNft: ", selectedNFTs)
      
      for (const tokenId  of selectedNFTs) {
        console.log("selectedNft ID: ", tokenId )
        const { offerId, transactionId } = await createBarterOffer(listingId, tokenId, durationInHours);

        console.log("offerId:", offerId);
        console.log("transactionId:", transactionId);

        if (offerId) {
          offerIds.push(offerId);
        }
      }

      if (offerIds.length > 0) {
        setLoading(true);
        router.push(
          `/view_offer?listingId=${listingId}&offerId=${offerIds[0]}`
        );
      }
    } catch (error) {
      console.error("Error creating the offer:", error);
      setError("Error creating the offer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={Styles.offerPage}>
      {error && <Error message={error} />}
      <Title
        heading={`Make an Offer for ${nftName}`}
        paragraph="Select 1 or 2 products from your owned items to make an offer with."
      />

      <div className={FormStyle.upload_box_slider_div}>
        {userNFTs.map((nft, i) => (
          <div
            key={nft.tokenId}
            className={`${FormStyle.upload_box_slider} ${
              selectedNFTs.includes(nft.tokenId) ? FormStyle.active : ""
            }`}
            onClick={() => handleNFTSelection(nft.tokenId)}
          >
            <div className={FormStyle.upload_box_slider_box}>
              <div className={FormStyle.upload_box_slider_box_img}>
                <Image
                  className={FormStyle.upload_box_slider_box_img_img}
                  src={nft.image}
                  alt={nft.name}
                  width={150}
                  height={150}
                />
              </div>
              <div className={FormStyle.upload_box_slider_box_img_icon}>
                {selectedNFTs.includes(nft.tokenId) && <TiTick />}
              </div>
            </div>
            <p>{nft.name}</p>
          </div>
        ))}
      </div>

      <div className={Styles.Form_box}>
        <div className={Styles.Form_box_input}>
          <label htmlFor="offerMessage">Offer message</label>
          <div className={Styles.inputField}>
            <textarea
              id="offerMessage"
              cols={80}
              rows={6}
              placeholder="Optional message to the item owner"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        <div className={Styles.Form_box_input}>
          <label htmlFor="duration">Offer Duration (Hours)</label>
          <div className={Styles.inputField}>
            <input
              type="number"
              id="duration"
              min="1"
              max="168" // Up to one week
              value={durationInHours}
              onChange={(e) => setDurationInHours(parseInt(e.target.value, 10))}
              placeholder="24"
            />
          </div>
        </div>
        <div
          className={Styles.submitButton}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "3rem",
            gap: "1rem",
          }}
        >
          <Button
            btnName="Submit Offer"
            handleClick={handleSubmitOffer}
            disabled={selectedNFTs.length === 0 || loading}
          />
          <Button btnName="Cancel" handleClick={handleCancel} />
        </div>
      </div>
    </div>
  );
};

export default OfferPage;
