import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaWallet, FaPercentage } from "react-icons/fa";
import { MdVerified, MdTimer, MdCancel, MdArrowBack } from "react-icons/md";
import Style from "../styles/view-offer.module.css";
import ProductStyle from "./ProductDetailsPage/ProductDescription/ProductDescription.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Button,
  Category,
  Title,
  Loader,
  Error,
} from "../components/componentsIndex";
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
    acceptBarterOffer,
    declineBarterOffer,
    handleExpiredOffers,
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

        if (parsedOfferId) {
          const fetchedOfferNFT = await fetchNFTByOfferId(parsedOfferId);
          const offerOwnerAddress = fetchedOfferNFT.itemOwner?.toLowerCase();

          if (userAddress === offerOwnerAddress) {
            setOfferNFTs(
              Array.isArray(fetchedOfferNFT)
                ? fetchedOfferNFT
                : [fetchedOfferNFT]
            );
          } else {
            setError("You are not authorized to view this offer.");
            setLoading(false);
            return;
          }
        } else if (userAddress === listingOwnerAddress) {
          const allOffers = await getBarterOffers(parsedListingId);
          setOfferNFTs(allOffers);
        } else {
          setError("You are not authorized to view this listing.");
          setLoading(false);

          const timer = setTimeout(() => {
            router.back();
          }, 3000);
          return () => clearTimeout(timer);
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
    return <Loader />;
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

  const handleDeclineBarterOffer = async (listingId, offerId, index) => {
    try {
      console.log("Declining offer:", offerId, "for listing:", listingId);

      // Call the declineBarterOffer function from your context or smart contract
      await declineBarterOffer(listingId, offerId);

      // Remove the declined offer from the offerNFTs array
      const updatedOfferNFTs = offerNFTs.filter((_, i) => i !== index);
      setOfferNFTs(updatedOfferNFTs); // Update state to trigger re-render
    } catch (error) {
      console.error("Error declining barter offer:", error);
    }
  };

  const handleAcceptBarterOffer = async (listingId, offerId, index) => {
    try {
      console.log("Accepting offer:", offerId, "for listing:", listingId);

      // Call the acceptBarterOffer function from your context or smart contract
      await acceptBarterOffer(listingId, offerId);

      // Remove the accepted offer from the offerNFTs array
      const updatedOfferNFTs = offerNFTs.filter((_, i) => i !== index);
      setOfferNFTs(updatedOfferNFTs); // Update state to trigger re-render

      // Optionally, redirect or show a success message
      console.log("Barter offer accepted successfully");
      router.push(`/author?tab=owned&walletAddress=${currentAccount.address}`);
    } catch (error) {
      console.error("Error accepting barter offer:", error);
    }
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

        {/* Offer NFT Section */}
        <div className={Style.nft_offer_container}>
          {offerNFTs.length === 0 ? (
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
                {offerNFTs
                  .filter(
                    (offerNFT) =>
                      Number(offerNFT.offerExpire) > Date.now() / 1000 // Filter only non-expired offers
                  )
                  .map((offerNFT, index) => {
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
                            {currentAccount?.address?.toLowerCase() ===
                              offererAddress?.toLowerCase()
                              ? "My Pending Offer"
                              : `Offer #${index + 1}/${offerNFTs.filter(
                                (offerNFT) =>
                                  Number(offerNFT.offerExpire) >
                                  Date.now() / 1000
                              ).length
                              }`}
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

                          {/* Show buttons aligned in a row for the listing owner */}
                          {currentAccount?.address?.toLowerCase() ===
                            listingNFT.itemOwner?.toLowerCase() ? (
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "10px",
                                justifyContent: "center",
                              }}
                            >
                              <Button
                                icon={<FaWallet />}
                                btnName="Accept Offer"
                                handleClick={() =>
                                  handleAcceptBarterOffer(
                                    Number(listingNFT.tokenId),
                                    Number(offerNFT.offerId),
                                    index
                                  )
                                }
                                classStyle={Style.accept_button}
                              />
                              <Button
                                icon={<MdCancel />}
                                btnName="Reject Offer"
                                handleClick={() =>
                                  handleDeclineBarterOffer(
                                    Number(listingNFT.tokenId),
                                    Number(offerNFT.offerId),
                                    index
                                  )
                                }
                                classStyle={Style.decline_button}
                              />
                              <Button
                                icon={<MdArrowBack />}
                                btnName="Back to My Items"
                                handleClick={() => {
                                  router.push(
                                    `/author?tab=owned&walletAddress=${currentAccount.address}`
                                  );
                                }}
                                classStyle={Style.pending_button}
                              />
                            </div>
                          ) : (
                            /* Buttons for the offerer */
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "10px",
                              }}
                            >
                              <Button
                                icon={<MdTimer />}
                                btnName="Pending Offer"
                                classStyle={Style.pending_button}
                                disabled
                              />
                              <Button
                                icon={<MdCancel />}
                                btnName="Cancel My Offer"
                                handleClick={() =>
                                  handleDeclineBarterOffer(
                                    Number(listingNFT.tokenId),
                                    Number(offerNFT.offerId),
                                    index
                                  )
                                }
                                classStyle={Style.decline_button}
                              />
                              <Button
                                icon={<MdArrowBack />}
                                btnName="Go Back"
                                handleClick={() => {
                                  router.push(
                                    `/author?tab=owned&walletAddress=${currentAccount.address}`
                                  );
                                }}
                                classStyle={Style.pending_button}
                              />
                            </div>
                          )}
                        </div>
                      </SwiperSlide>
                    );
                  })}
              </Swiper>

              <div className={Style.slider_controller}>
                <div className="swiper-button-prev slider-arrow"></div>
                <div className="swiper-button-next slider-arrow"></div>
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

