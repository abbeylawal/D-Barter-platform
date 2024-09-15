import React, { useState, useEffect, useContext } from 'react';
import Image from "next/image";
import { MdVerified, MdCloudUpload, MdTimer, MdReport, MdOutlineDeleteSweep, MdReportProblem } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FaWallet, FaPercentage } from 'react-icons/fa';
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialTwitter,
  TiSocialInstagram,
} from "react-icons/ti";
import { BiTransferAlt, BiDollar } from "react-icons/bi";
import Link from "next/link";
import userData from "../../../assets/Data/userData.json";
import {useRouter} from "next/router";
// SMART CONTRACT
import { NFTMarketplaceContext } from "../../../../SmartContract/Context/NFTMarketplaceContext";

import Style from "./ProductDescription.module.css";
import images from "../../../assets/img";
import { Button } from "../../../components/componentsIndex";
import { ProductTabs } from "../ProductDetailsIndex"

const ProductDescription = ({ nft }) => {
  const { currentAccount, getBarterOffers, fetchAvailableNFTsForBarter } = useContext(NFTMarketplaceContext);

  const router = useRouter();
  let userId = 0;

  if (nft.creatorId) {
    if (nft.itemOwner) {
      userId = nft.creatorId;
    } else {
      userId = nft.creatorId - 1;
    }
  } else if (nft.userId) {
    userId = nft.userId;
  }


  const user = userData[userId] ? userData[userId] : null;
  const userAddress = currentAccount ? currentAccount.address : user.walletAddress;
  const [social, setSocial] = useState(false);
  const [productMenu, setProductMenu] = useState(false);
  const [history, setHistory] = useState(false);
  const [provenance, setProvenance] = useState(false);
  const [owner, setOwner] = useState(false);
  const [activeTab, setActiveTab] = useState('creators history');
  const [offerStatus, setOfferStatus] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);


  const makeOffer = (nft) => {
    const offerAddress = currentAccount.address;
    const itemCreator = userId;

    router.push({
      pathname: "/offer_page",
      query: {
        offerAddress: offerAddress,
        itemCreatorId: nft.CreatorId,
        listingId: nft.listingId,
        nftName: nft.name,
      },
    });
  };

  const historyArray = [
    { image: images.user3, name: 'John Doe', date: 'Jun 14 - 4:12 PM' },
    { image: images.user10, name: 'Alice Smith', date: 'Jun 15 - 3:10 PM' },
    { image: images.user4, name: 'Michael Brown', date: 'Jun 16 - 2:08 PM' },
    { image: images.user5, name: 'Eva Green', date: 'Jun 17 - 1:06 PM' }
  ];

  const provenanceArray = [
    {
      image: user ? user.userImage : images.user2,
      name: user ? user.userName : "Default User",
      date: 'Aug 21 - 1:09 PM'
    },
    { image: images.user6, name: 'William Black', date: 'July 25 - 12:04 PM' },
    { image: images.user7, name: 'Sophia White', date: 'July 13 - 11:02 AM' },
    { image: images.user3, name: 'John Doe', date: 'Jun 28 - 10:00 AM' },
  ];

  const OwnerArray = user
    ? [{ image: user.userImage }]
    : [{ image: images.user2 }];


  const openSocial = () => {
    setSocial(!social);
  }

  const openMenu = () => {
    setProductMenu(!productMenu);
  }

  const openTabs = (e) => {
    const btnText = e.target.innerText.toLowerCase();
    setActiveTab(btnText);
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'creators history':
        return <ProductTabs dataTab={historyArray} activeTab={activeTab} />;
      case 'provenance':
        return <ProductTabs dataTab={provenanceArray} activeTab={activeTab} />;
      case 'owner':
        return <ProductTabs dataTab={OwnerArray} activeTab={activeTab} />;
      default:
        return null;
    }
  }

  const handleAwaitingOfferClick = () => {
    if (!nft.tokenId) {
      console.error("Error: Listing ID is undefined.");
      return; // Prevents routing if listingId is not set
    }

    router.push(`/view_offer?listingId=${nft.tokenId}`);
  };


  const isOwner = currentAccount && nft.itemOwner &&
    currentAccount.address.toLowerCase() === nft.itemOwner.toLowerCase();

  const isContractOwner = currentAccount && nft.contractOwner &&
    currentAccount.address.toLowerCase() === nft.contractOwner.toLowerCase();


  const renderOfferButton = () => {
    if (isContractOwner) {
      return <p>Item Listed on MarketPlace</p>;
    } else if (isOwner) {
      return (
        <>
          <p style={{ lineHeight: 1, color: 'yellow' }}>Item Listed on MarketPlace!</p>
          <Button
            icon={<FaWallet />}
            btnName="Awaiting Offer"
            handleClick={handleAwaitingOfferClick}
            classStyle={Style.button}
          />
        </>
      );
    } else {
      return (
        <Button
          icon={<FaWallet />}
          btnName="Make Offer"
          handleClick={() => makeOffer(nft)}
          classStyle={Style.button}
        />
      );
    }
  };


  return (
    <div className={Style.ProductDescription}>
      <div className={Style.ProductDescription_box}>
        {/* Part ONE */}
        <div className={Style.ProductDescription_box_share}>
          <p>
            Virtual Worlds
          </p>
          <div className={Style.ProductDescription_box_share_box}>
            <MdCloudUpload className={Style.ProductDescription_box_share_box_icon}
              onClick={openSocial}
            />
            {social && (
              <div className={Style.ProductDescription_box_share_box_social}>
                <a href="#">
                  <TiSocialFacebook /> Facebook
                </a>
                <a href="#">
                  <TiSocialInstagram /> Instagram
                </a>
                <a href="#">
                  <TiSocialLinkedin /> Linkedin
                </a>
                <a href="#">
                  <TiSocialTwitter /> Twitter
                </a>
              </div>
            )}

            <BsThreeDots className={Style.ProductDescription_box_share_box_icon}
              onClick={openMenu}
            />

            {productMenu && (
              <div className={Style.ProductDescription_box_share_box_social}>
                <a href="#">
                  <BiDollar /> Change Price
                </a>
                <a href="#">
                  <BiTransferAlt /> Transfer
                </a>
                <a href="#">
                  <MdReportProblem /> Report Abuse
                </a>
                <a href="#">
                  <MdOutlineDeleteSweep /> Delete
                </a>
              </div>
            )}
          </div>
        </div>
        <div className={Style.ProductDescription_box_profile}>
          <h1>{nft.name} #{nft.tokenId}</h1>
          <div className={Style.ProductDescription_box_profile_box}>
            <div className={Style.ProductDescription_box_profile_box_left}>
              <Image
                className={Style.ProductDescription_box_profile_box_left_img}
                src={user.userImage}
                alt='Profile'
                width={40}
                height={40}
              />
              <div className={Style.ProductDescription_box_profile_box_left_info}>
                <small>Creator</small><br />
                {currentAccount && currentAccount !== "" ? (
                  <Link
                    href={{
                      pathname: "/author",
                      query: {
                        tab: "owned",
                        walletAddress: nft.itemOwner || nft.walletAddress,
                        creatorId: userId
                      }
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

          <div className={Style.ProductDescription_box_profile_bidding}>
            <p>
              <MdTimer />
              <span> Listing Ending in: </span>
            </p>

            <div className={Style.ProductDescription_box_profile_bidding_box_timer}>
              <div className={Style.ProductDescription_box_profile_bidding_box_timer_item}>
                <p>2</p>
                <span>Days</span>
              </div>
              <div className={Style.ProductDescription_box_profile_bidding_box_timer_item}>
                <p>21</p>
                <span>hours</span>
              </div>
              <div className={Style.ProductDescription_box_profile_bidding_box_timer_item}>
                <p>43</p>
                <span>mins</span>
              </div>
              <div className={Style.ProductDescription_box_profile_bidding_box_timer_item}>
                <p>53</p>
                <span>sec</span>
              </div>
            </div>

            <div className={Style.ProductDescription_box_profile_box_price}>
              <div className={Style.ProductDescription_box_profile_box_price_bid}>
                <small>Swap With</small>

                {/* TODO: using swap with category  */}
                <p style={{ marginTop: "1.5rem" }}>
                  {Array.isArray(nft.swapCategory) ? nft.swapCategory.join(", ") : nft.swapCategory}
                </p>
              </div>
            </div>

            <div className={Style.ProductDescription_box_profile_bidding_box_button}>
              {renderOfferButton()}
              {/* {currentAccount && currentAccount.address && nft.contractOwner &&
                currentAccount.address.toLowerCase() === nft.contractOwner.toLowerCase() ? (
                <p>Item Listed on MarketPlace</p>
              ) : currentAccount && currentAccount.address && nft.itemOwner &&
                currentAccount.address.toLowerCase() === nft.itemOwner.toLowerCase() ? (
                <p style={{ "lineHeight": 1, "color": 'yellow' }}>Item Listed on MarketPlace !!</p>

                    // TODO: if there is an offer on the current product then a disabled button showing pending offer 
                // <Button
                //   icon={<FaWallet />}
                //   btnName="List on Marketplace"
                //   handleClick={() => { }}
                //   classStyle={Style.button}
                // />
              ) : (
                    // TODO: if the current userB as made and offer to the itemOwner then this should be a 2 day count down stimulating a open product time lock  and graded out
                <Button
                  icon={<FaWallet />}
                  btnName="Make Offer"
                  handleClick={() => makeOffer(nft)}
                  classStyle={Style.button}
                />
              )}


              {currentAccount && currentAccount.address && nft.contractOwner &&
                currentAccount.address.toLowerCase() === nft.contractOwner.toLowerCase() ? (
                <p>Item Listed on MarketPlace</p>
              ) : currentAccount && currentAccount.address && nft.itemOwner &&
                currentAccount.address.toLowerCase() === nft.itemOwner.toLowerCase() ? (
                
                // TODO: if there is an offer on the current product then button to view offer 
                <Button
                  icon={<FaWallet />}
                  btnName="Awaiting Offer"
                  handleClick={() => { }}
                  classStyle={Style.button}
                />
                ) : (
                    
                    // TODO: if ther current userB as made and offer to the itemOwner then this should be a cancel offer and in red 
                <Button
                  icon={<FaWallet />}
                  btnName="Make Offer"
                  handleClick={() => makeOffer(nft)}
                  classStyle={Style.button}
                />
              )} */}



              {/* <Button
                icon={<FaPercentage />}
                btnName="Make Offer"
                handleClick={() => { }}
                classStyle={Style.button}
              /> */}

            </div>

            <div className={Style.ProductDescription_box_profile_bidding_box_tabs}>
              <button
                onClick={openTabs}
                className={activeTab === 'creators history' ? Style.active : ''}
              >
                Creators History
              </button>
              <button
                onClick={openTabs}
                className={activeTab === 'provenance' ? Style.active : ''}
              >
                Provenance
              </button>
              <button
                onClick={openTabs}
                className={activeTab === 'owner' ? Style.active : ''}
              >
                Owner
              </button>
            </div>
            <div className={Style.ProductDescription_box_profile_bidding_box_card}>
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDescription;