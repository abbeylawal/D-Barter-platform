import React, { useState, useContext } from 'react';
import Image from "next/image";
import { MdVerified, MdCloudUpload, MdOutlineReportProblem } from "react-icons/md";
import { FiCopy } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";

import Style from "./AuthorProfileCard.module.css";
import images from "../../../assets/img";
import { Button } from "../../../components/componentsIndex";
import { TiSocialFacebook, TiSocialInstagram, TiSocialLinkedin, TiSocialTwitter } from 'react-icons/ti';
import users from "../../../assets/Data/userData.json";

import { NFTMarketplaceContext } from "../../../../SmartContract/Context/NFTMarketplaceContext";

const AuthorProfileCard = () => {

    const { currentAccount } = useContext(NFTMarketplaceContext);

    const userId = currentAccount ? currentAccount.userId : 1;
    const user = users[userId]
    const userAddress = currentAccount ? currentAccount.address : user.walletAddress;

    const shortenedAddress = `${userAddress.slice(0, 6)}....${userAddress.slice(-3)}`;
    const [share, setShare] = useState(false);
    const [report, setReport] = useState(false);

    const copyAddress = () => {
        const addressInput = document.getElementById('AddressInput');
        addressInput.select();
        // document.execCommand('copy');
        navigator.clipboard.writeText(copyText.value);
    };

    const openShare = () => {
        setShare(!share);
    };

    const openReport = () => {
        setReport(!report);
    };


    return (
        <div className={Style.AuthorProfileCard}>
            <div className={Style.AuthorProfileCard_box}>
                <div className={Style.AuthorProfileCard_box_img}>
                    <Image
                        className={Style.AuthorProfileCard_box_img_img}
                        // src={images.nft_image_1}
                        src={user.userImage}
                        alt='NFT Image'
                        width={220}
                        height={220}
                    />
                </div>

                <div className={Style.AuthorProfileCard_box_info}>
                    <h2>{user.creatorName} {""}{" "}
                        <span>
                            <MdVerified />
                        </span>{" "}
                    </h2>

                    <div className={Style.AuthorProfileCard_box_info_address}>
                        <input
                            type="text"
                            value={userAddress}
                            id='AddressInput'
                            readOnly
                        />
                        <FiCopy
                            onClick={copyAddress}
                            className={Style.copy_icon}
                        />
                    </div>
                    <p>Author Bio Description</p>

                    <div className={Style.AuthorProfileCard_box_info_social}>
                        <a href="#">
                            <TiSocialFacebook />
                        </a>
                        <a href="#">
                            <TiSocialInstagram />
                        </a>
                        <a href="#">
                            <TiSocialLinkedin />
                        </a>
                        <a href="#">
                            <TiSocialTwitter />
                        </a>
                    </div>
                </div>
                <div className={Style.AuthorProfileCard_box_share}>
                    <Button btnName="Follow" handleClick={() => { }} />
                    <MdCloudUpload onClick={openShare} className={Style.AuthorProfileCard_box_share_icon} />

                    {share && (
                        <div className={Style.AuthorProfileCard_box_share_upload}>
                            <p>
                                <span>
                                    <TiSocialFacebook />
                                </span>{" "}
                                {""}
                                Facebook
                            </p>
                            <p>
                                <span>
                                    <TiSocialInstagram />
                                </span>{" "}
                                {""}
                                Instagram
                            </p>
                            <p>
                                <span>
                                    <TiSocialLinkedin />
                                </span>{" "}
                                {""}
                                Linkedin
                            </p>
                            <p>
                                <span>
                                    <TiSocialTwitter />
                                </span>{" "}
                                {""}
                                Twitter
                            </p>
                        </div>
                    )}

                    <BsThreeDots onClick={openReport} className={Style.AuthorProfileCard_box_share_icon} />

                    {report && (
                        <p className={Style.AuthorProfileCard_box_share_report}>
                            <span>
                                <MdOutlineReportProblem />
                            </span>
                            Report
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
};

export default AuthorProfileCard;
