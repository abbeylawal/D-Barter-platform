import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaWallet, FaPercentage } from "react-icons/fa";
import { MdVerified, MdTimer, MdCancel } from 'react-icons/md';
import Style from "../styles/view-offer.module.css";
import ProductStyle from "./ProductDetailsPage/ProductDescription/ProductDescription.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Button, Category, Title, Loader, Error } from "../components/componentsIndex";
import images from "../assets/img";
import userData from "../assets/Data/userData.json";

// SMART CONTRACT
import { NFTMarketplaceContext } from "../../SmartContract/Context/NFTMarketplaceContext";
import Image from "next/image";
import Link from "next/link";


const ViewOffer = () => {
  const {
    fetchNFTByListingId,
    fetchNFTByOfferId,
    getBarterOffers,
    currentAccount,
    checkWalletConnection,
  } = useContext(NFTMarketplaceContext);

  const [listingNFT, setListingNFT] = useState(null);
  const [offerNFTs, setOfferNFTs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdowns, setCountdowns] = useState({});
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const router = useRouter();

  // Ensure wallet is connected before fetching NFTs
  useEffect(() => {
    const ensureWalletConnection = async () => {
      if (!currentAccount) {
        const account = await checkWalletConnection();
        if (account) {
          setIsWalletConnected(true);
        }
      } else {
        setIsWalletConnected(true);
      }
    };

    ensureWalletConnection();
  }, [currentAccount, checkWalletConnection]);

  // Fetching the NFTs when the component mounts
  useEffect(() => {
    // Wait until the wallet is connected
    if (!router.isReady || !isWalletConnected) return;

    const { listingId, offerId } = router.query;
    const parsedListingId = parseInt(listingId);
    const parsedOfferId = offerId ? parseInt(offerId) : null;

    if (isNaN(parsedListingId) || (offerId && isNaN(parsedOfferId))) {
      setError("Invalid listingId or offerId");
      setLoading(false);
      return;
    }

    const fetchNFTs = async () => {
      try {
        const fetchedListingNFT = await fetchNFTByListingId(parsedListingId);
        setListingNFT(fetchedListingNFT);

        const userAddress = currentAccount?.address?.toLowerCase();
        const listingOwnerAddress = fetchedListingNFT.itemOwner?.toLowerCase();

        // Log the addresses for debugging
        console.log("User Address:", userAddress);
        console.log("Listing Owner Address:", listingOwnerAddress);

        if (parsedOfferId) {
          const fetchedOfferNFT = await fetchNFTByOfferId(parsedOfferId);
          const offerOwnerAddress = fetchedOfferNFT.itemOwner?.toLowerCase();

          // Log the offer owner address for debugging
          console.log("Offer Owner Address:", offerOwnerAddress);

          // Check if the viewer is the offer owner
          if (userAddress === offerOwnerAddress) {
            setOfferNFTs(
              Array.isArray(fetchedOfferNFT)
                ? fetchedOfferNFT
                : [fetchedOfferNFT]
            );
          } else {
            console.log("User is not the offer owner.");
            setError("You are not authorized to view this offer.");
            setLoading(false);
            return;
          }
        } else if (userAddress === listingOwnerAddress) {
          // If the viewer is the listed NFT owner
          console.log("User is the listing owner.");
          const allOffers = await getBarterOffers(parsedListingId);
          setOfferNFTs(allOffers);
        } else {
          console.log("User is neither the listing owner nor the offer owner.");
          setError("You are not authorized to view this listing.");
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching NFTs:", err);
        setError("Error fetching NFTs. Please try again.");
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [
    router.isReady,
    router.query,
    fetchNFTByListingId,
    fetchNFTByOfferId,
    getBarterOffers,
    checkWalletConnection,
    currentAccount,
    isWalletConnected,
  ]);

  // Managing countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const newCountdowns = offerNFTs.reduce((acc, offerNFT) => {
        const expirationTime = Number(offerNFT.offerExpire);
        const expirationDateTime = new Date(expirationTime * 1000).getTime();
        const now = new Date().getTime();

        const timeLeft = expirationDateTime - now;

        if (timeLeft > 0) {
          const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
          const seconds = Math.floor((timeLeft / 1000) % 60);
          acc[offerNFT.tokenId] = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          acc[offerNFT.tokenId] = "Expired";
        }
        return acc;
      }, {});
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(timer);
  }, [offerNFTs]);

  if (loading) {
    return <Loader />; // Display loading component while fetching data
  }

if (error) {
  return <Error message={error} />;
}

  if (!listingNFT) {
    setError("No NFT data available.");
    setLoading(false);
  }

  const userId = listingNFT.creatorId || listingNFT.userId || 1;
  const user = userData[userId] || {
    userName: "Unknown User",
    userImage: images.user1,
  };

  return (
    <div>
      <Title
        heading="View Offer Page"
        paragraph="Confirm or decline offer transactions"
      />
      <div className={Style.view_offer}>
        <div className={Style.nft_side}>
          <h3>Listed NFT</h3>
          <Image
            src={listingNFT.image || "/placeholder.png"}
            alt={listingNFT.name || "Unnamed NFT"}
            width={400}
            height={400}
            style={{ objectFit: "contain" }}
          />
          <h1>
            {listingNFT.name} #{listingNFT.tokenId}
          </h1>
          <div
            className={ProductStyle.ProductDescription_box_profile_box}
            style={{
              justifyContent: "center",
            }}
          >
            <div
              className={ProductStyle.ProductDescription_box_profile_box_left}
            >
              <Image
                className={
                  ProductStyle.ProductDescription_box_profile_box_left_img
                }
                src={user.userImage}
                alt="Profile"
                width={40}
                height={40}
              />
              <div
                className={
                  ProductStyle.ProductDescription_box_profile_box_left_info
                }
              >
                <small>Current Owner</small>
                <br />
                {currentAccount ? (
                  <Link
                    href={{
                      pathname: "/author",
                      query: {
                        tab: "owned",
                        walletAddress:
                          listingNFT.itemOwner || listingNFT.walletAddress,
                        creatorId: userId,
                      },
                    }}
                  >
                    <span>
                      {user.userName} <MdVerified />
                    </span>
                  </Link>
                ) : (
                  <span>
                    {user.userName} <MdVerified />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* offer NFT Section */}
        <div className={Style.nft_offer_container}>
          {offerNFTs.length === 0 ? (
            // No Offers Available
            <div
              style={{ textAlign: "center", padding: "20px", margin: "14rem" }}
            >
              <h3
                style={{
                  marginBottom: "20px",
                  color: "#ff6f61",
                  fontSize: "3rem",
                  fontWeight: "800",
                }}
              >
                No offers yet!
              </h3>
              <button
                onClick={() => router.back()}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#0070f3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Go Back
              </button>
            </div>
          ) : (
            // Display Offers
            <>
              <Swiper
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView="auto"
                coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: false,
                }}
                pagination={{ clickable: true }}
                modules={[EffectCoverflow, Pagination, Navigation]}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                  clickable: true,
                }}
                className="mySwiper"
              >
                {offerNFTs.map((offerNFT, index) => {
                  const offererId = offerNFT.creatorId;
                  const offerer = userData[offererId];
                  const offererAddress = offerNFT.itemOwner
                    ? offerNFT.itemOwner
                    : "Unknown Address";
                  const shortenedAddress = `${offererAddress.slice(
                    0,
                    6
                  )}....${offererAddress.slice(-3)}`;
                  const expirationTime = offerNFT.offerExpireDateTime;
                  const countdown =
                    countdowns[offerNFT.tokenId] || "Calculating...";

                  return (
                    <SwiperSlide key={index}>
                      <div className={`${Style.nft_side} swiper-slide`}>
                        <h3>
                          Offer #{index + 1}/{offerNFTs.length}
                        </h3>
                        <Image
                          src={offerNFT.image || "/placeholder.png"}
                          alt={offerNFT.name || "Unnamed NFT"}
                          width={300}
                          height={300}
                          style={{ objectFit: "contain" }}
                        />
                        <p>{offerNFT.name || "Unnamed NFT"}</p>
                        <p>Offerer: {offerer ? offerer.userName : "Unknown"}</p>
                        <p>Address: {shortenedAddress}</p>
                        <p>Offer Lock Till: {expirationTime}</p>
                        <p>Time Left: {countdown}</p>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              <div className={Style.slider_controller}>
                <div className="swiper-button-prev slider-arrow"></div>
                <div className="swiper-button-next slider-arrow"></div>
              </div>

              <div className={Style.box_tabs}>
                {/* Check if the user is the offerer */}
                {offerNFTs.some(
                  (offerNFT) =>
                    offerNFT.itemOwner?.toLowerCase() ===
                    currentAccount?.address?.toLowerCase()
                ) ? (
                  <>
                    <Button
                      icon={<MdTimer />}
                      btnName="Pending Offer"
                      classStyle={Style.pending_button}
                      disabled 
                    />
                    <Button
                      icon={<MdCancel />}
                      btnName="Cancel Offer"
                      handleClick={() => {}}
                      classStyle={Style.decline_button}
                    />
                  </>
                ) : (
                  <>
                    {/* If the user is the listing owner */}
                    <Button
                      icon={<FaWallet />}
                      btnName="Accept Offer"
                      handleClick={() => {}}
                      classStyle={Style.accept_button}
                    />
                    <Button
                      icon={<MdCancel />}
                      btnName="Reject Offer"
                      handleClick={() => {}}
                      classStyle={Style.decline_button}
                    />
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <Category />
      </div>
    </div>
  );
};

export default ViewOffer;