import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaWallet, FaPercentage } from "react-icons/fa";
import { MdVerified, MdTimer, MdCancel } from 'react-icons/md';
import { TbArrowBigLeftLines, TbArrowBigRightLines } from 'react-icons/tb';
import Style from "../styles/view-offer.module.css";
import ProductStyle from "./ProductDetailsPage/ProductDescription/ProductDescription.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import SwiperCore, { EffectCoverflow, Pagination, Navigation } from "swiper";
import { Button, Category } from "../components/componentsIndex";
// import ProductDetailsPage from "./ProductDetailsPage/ProductDetailsPage";
import images from "../assets/img";
import userData from "../assets/Data/userData.json";

// SMART CONTRACT
import { NFTMarketplaceContext } from "../../SmartContract/Context/NFTMarketplaceContext";
import Image from "next/image";
import Link from "next/link";


const dummyListingNFT = {
  tokenId: 1,
  owner: "0x123...abc",
  creatorId: 1,
  contractOwner: "0xContractAddress",
  itemOwner: "0xOwnerAddress",
  likes: 42,
  name: "Dummy NFT Listing",
  description: "This is a dummy NFT listing for testing purposes.",
  // image: "https://via.placeholder.com/150",
  image: images.NFT_image_1,
  category: "Art",
  swapCategory: ["Collectibles"],
};

const dummyOfferNFTs = [
  {
    tokenId: 101,
    owner: "0x456...def",
    creatorId: 2,
    contractOwner: "0xContractAddress",
    itemOwner: "0xOwnerAddress",
    likes: 24,
    name: "Dummy Offer #1",
    description: "This is a dummy NFT offer for testing purposes.",
    // image: "https://via.placeholder.com/150/0000FF/808080?text=Offer1",
    image: images.NFT_image_5,
    category: "Music",
    swapCategory: ["Digital Art"],
  },

  {
    tokenId: 102,
    owner: "0x789...ghi",
    creatorId: 3,
    contractOwner: "0xContractAddress",
    itemOwner: "0xOwnerAddress",
    likes: 15,
    name: "Dummy Offer #2",
    description: "This is another dummy NFT offer for testing purposes.",
    // image: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Offer2",
    image: images.NFT_image_6,
    category: "Photography",
    swapCategory: ["Memes"],
  },

  {
    tokenId: 103,
    owner: "0x789...ghi",
    creatorId: 3,
    contractOwner: "0xContractAddress",
    itemOwner: "0xOwnerAddress",
    likes: 15,
    name: "Dummy Offer #2",
    description: "This is another dummy NFT offer for testing purposes.",
    // image: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Offer2",
    image: images.NFT_image_8,
    category: "Photography",
    swapCategory: ["Memes"],
  },
];


const ViewOffer = () => {
  const { fetchNFTByListingId, fetchNFTByOfferId, currentAccount } = useContext(
    NFTMarketplaceContext
  );

  const [listingNFT, setListingNFT] = useState(null);
  const [offerNFTs, setOfferNFTs] = useState(null);
  const [activeOffer, setActiveOffer] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    // Use dummy data for testing
    setListingNFT(dummyListingNFT);
    // setOfferNFTs(dummyOfferNFTs);

    // Parse query parameters
    const { listingId, offerId } = router.query;
    const parsedListingId = parseInt(listingId, 10);
    const parsedOfferId = parseInt(offerId, 10);

    if (isNaN(parsedListingId) || isNaN(parsedOfferId)) {
      setError("Invalid listingId or offerId");
      return;
    }

    // Fetch NFTs based on listingId and offerId
    const fetchNFTs = async () => {
      try {
        const fetchedListingNFT = await fetchNFTByListingId(parsedListingId);
        const fetchedOfferNFT = await fetchNFTByOfferId(parsedOfferId);

        setListingNFT(fetchedListingNFT);

        
        setOfferNFT(fetchedOfferNFT);
      } catch (err) {
        console.error("Error fetching NFTs:", err);
        setError("Error fetching NFTs. Please try again.");
      }
    };

    fetchNFTs();
  }, [router.isReady, router.query, fetchNFTByListingId, fetchNFTByOfferId]);

  if (error) {
    return <div className={Style.error}>{error}</div>;
  }
  
  
  if (!listingNFT || offerNFTs.length === 0) {
    return <div className={Style.error}>No NFT data available.</div>;
  }

  const userId = listingNFT.creatorId || listingNFT.userId || 1;
  const user = userData[userId] || {
    userName: "Unknown User",
    userImage: images.user1,
  };

  const userAddress = currentAccount
    ? currentAccount.address
    : user.walletAddress;

  return (
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
        <div className={ProductStyle.ProductDescription_box_profile_box}
        style={{
          justifyContent: "center",
        }}
        >
          <div className={ProductStyle.ProductDescription_box_profile_box_left}>
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
              <br/>
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

      <div className={Style.nft_offer_container}>
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
            const offererAddress = offerer
              ? offerer.walletAddress
              : "Unknown Address";

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
                  <p>Offerer: {offerer ? offerer.name : "Unknown"}</p>
                  <p>Address: {offererAddress}</p>
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
        </div>
      </div>
    </div>
  );
};

export default ViewOffer;