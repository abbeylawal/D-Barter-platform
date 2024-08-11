import React, { useState } from 'react';
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

import Style from "./ProductDescription.module.css";
import images from "../../../assets/img";
import { Button } from "../../../components/componentsIndex";
import { ProductTabs } from "../ProductDetailsIndex"

const ProductDescription = () => {
  const [social, setSocial] = useState(false);
  const [productMenu, setProductMenu] = useState(false);
  const [history, setHistory] = useState(false);
  const [provenance, setProvenance] = useState(false);
  const [owner, setOwner] = useState(false);
  const [activeTab, setActiveTab] = useState('creators history');

  const historyArray = [
    images.user1,
    images.user10,
    images.user4,
    images.user5
  ]
  const provenanceArray = [
    images.user6,
    images.user7,
    images.user3,
    images.user2
  ]
  const OwnerArray = [
    images.user1,
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
        return <ProductTabs dataTab={historyArray} />;
      case 'provenance':
        return <ProductTabs dataTab={provenanceArray} />;
      case 'owner':
        return <ProductTabs dataTab={OwnerArray} />;
      default:
        return null;
    }
  }

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
          <h1>BearX #23453</h1>
          <div className={Style.ProductDescription_box_profile_box}>
            <div className={Style.ProductDescription_box_profile_box_left}>
              <Image
                className={Style.ProductDescription_box_profile_box_left_img}
                src={images.user1}
                alt='Profile'
                width={40}
                height={40}
              />
              <div className={Style.ProductDescription_box_profile_box_left_info}>
                <small>Creator</small><br/>
                <span> Muftau Lawal <MdVerified />
                </span>
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
                <small>Current Bid</small>
                <p>
                  1.000 ETH <span>( $3, 221.22)</span>
                </p>
              </div>

              <span>[51 in stock]</span>
            </div>

            <div className={Style.ProductDescription_box_profile_bidding_box_button}>
              <Button
                icon={<FaWallet />}
                btnName="Place a bid"
                handleClick={() => { }}
                classStyle={Style.button}
              />
              <Button
                icon={<FaPercentage />}
                btnName="Make Offer"
                handleClick={() => { }}
                classStyle={Style.button}
              />
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