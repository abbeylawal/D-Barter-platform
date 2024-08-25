import React, { useState, useEffect, useContext } from 'react';
import Image from "next/image";
import { MdVerified, MdCloudUpload, MdTimer, MdReport, MdOutlineDeleteSweep, MdReportProblem } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FaWallet, FaPercentage } from 'react-icons/fa';
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialTwitter,
  TiSocialYoutube,
  TiSocialInstagram,
} from "react-icons/ti";
import { BiTransferAlt, BiDollar } from "react-icons/bi";
import Link from "next/link";
import userData from "../../../assets/Data/userData.json"
// SMART CONTRACT
import { NFTMarketplaceContext } from "../../../../SmartContract/Context/NFTMarketplaceContext";

import Style from "./ProductDescription.module.css";
import images from "../../../assets/img";
import { Button } from "../../../components/componentsIndex";
import { ProductTabs } from "../ProductDetailsIndex"

const ProductDescription = ({ nft }) => {
  const { currentAccount, accountMappingRef } = useContext(NFTMarketplaceContext);
  console.log("All Connected accounts: ", accountMappingRef)
  const userId = currentAccount ? currentAccount.userId : 1;
  const user = userData[userId];
  const userAddress = currentAccount ? currentAccount.address : user.walletAddress;
  const [social, setSocial] = useState(false);
  const [productMenu, setProductMenu] = useState(false);
  const [history, setHistory] = useState(false);
  const [provenance, setProvenance] = useState(false);
  const [owner, setOwner] = useState(false);
  const [activeTab, setActiveTab] = useState('creators history');

  const historyArray = [
    { image: images.user3, name: 'John Doe', date: 'Jun 14 - 4:12 PM' },
    { image: images.user10, name: 'Alice Smith', date: 'Jun 15 - 3:10 PM' },
    { image: images.user4, name: 'Michael Brown', date: 'Jun 16 - 2:08 PM' },
    { image: images.user5, name: 'Eva Green', date: 'Jun 17 - 1:06 PM' }
  ];

  const provenanceArray = [
    { image: images.user6, name: 'William Black', date: 'Jun 18 - 12:04 PM' },
    { image: images.user7, name: 'Sophia White', date: 'Jun 19 - 11:02 AM' },
    { image: images.user3, name: 'John Doe', date: 'Jun 20 - 10:00 AM' },
    { image: images.user2, name: 'Emma Stone', date: 'Jun 21 - 9:58 AM' }
  ];
  const OwnerArray = [
    {image: images.user1,}
  ]


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

  // Smart Contract Data
  // const { makeOffer, currentAccount } = useContext(NFTMarkplaceContext);

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
                src={images.user2}
                alt='Profile'
                width={40}
                height={40}
              />
              <div className={Style.ProductDescription_box_profile_box_left_info}>
                <small>Creator</small><br />
                <Link href={{ pathname: "/author", query: `${nft.seller}` }} >
                  <span> Muftau Lawal <MdVerified />
                  </span>
                </Link>
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
              {currentAccount && currentAccount.address.toLowerCase() === nft.contractOwner.toLowerCase() ? (
                <p>Item Listed on MarketPlace</p>
              ) : currentAccount && currentAccount.address.toLowerCase() === nft.itemOwner.toLowerCase() ? (
                <Button
                  icon={<FaWallet />}
                  btnName="List on Marketplace"
                  handleClick={() => { }}
                  classStyle={Style.button}
                />
              ) : (
                <Button
                  icon={<FaWallet />}
                  btnName="Make Offer"
                  handleClick={() => makeOffer(nft)}
                  classStyle={Style.button}
                />
              )}
              {currentAccount && currentAccount.address.toLowerCase() === nft.contractOwner.toLowerCase() ? (
                <p>Item Listed on MarketPlace</p>
              ) : currentAccount && currentAccount.address.toLowerCase() === nft.itemOwner.toLowerCase() ? (
                <Button
                  icon={<FaWallet />}
                  btnName="List on Marketplace"
                  handleClick={() => { }}
                  classStyle={Style.button}
                />
              ) : (
                <Button
                  icon={<FaWallet />}
                  btnName="Make Offer"
                  handleClick={() => makeOffer(nft)}
                  classStyle={Style.button}
                />
              )}


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