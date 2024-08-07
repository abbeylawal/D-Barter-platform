import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { GrClose } from "react-icons/gr";
import {
    TiSocialFacebook,
    TiSocialLinkedin,
    TiSocialTwitter,
    TiSocialYouTube,
    TiSocialInstagram,
    TiArrowSortedDown,
    TiArrowSortedUp,
} from "react-icons/ti"

// Internal Imports
import Style from "./SideBar.module.css";
import images from "../../../asserts/img";
import Button from "../../Button/Button";


// -------  SideBar -----------
const SideBar = ({ setOpenSideMenu }) => {
    // -- USE - STATE
    const [openDiscover, setOpenDiscover] = useState(false);
    const [openHelp, setOpenHelp] = useState(false);

    // ---- Discover ----
    const discover = [
        {
            name: "Collection",
            link: "collection"
        },
        {
            name: "Search",
            link: "search"
        },
        {
            name: "Author Profile",
            link: "author-profile"
        },
        {
            name: "NFT Details",
            link: "nft-details"
        },
        {
            name: "Account Setting",
            link: "account-setting"
        },
        {
            name: "Connect Wallet",
            link: "connect-wallet"
        }
    ];

    // --- HelpCenter ----
    const helpCenter = [
        {
            name: "About",
            link: "about"
        },
        {
            name: "Register",
            link: "register"
        },
        {
            name: "Sign In",
            link: "sign-in"
        },
        {
            name: "Subscription",
            link: "subscription"
        },
        {
            name: "Track Exchange",
            link: "track-exchange"
        }
    ];

    // Functions
    const openDiscoverMenu = () => {
        if (!openDiscover) {
            setOpenDiscover(true);
        } else {
            setOpenDiscover(false);
        }
    };

    const openHelpMenu = () => {
        if (!openHelp) {
            setOpenHelp(true);

        } else {
            setOpenHelp(false);
        }
    };

    const closeSideBar = () => {
        setOpenSideMenu(false);
    }


    return (
        <div className={Style.sidebar}>
            <GrClose className={Style.sidebar_closeBtn} onClick={() => closeSideBar()} />
            <div className={Style.sidebar_box}>
                <Image src={images.logo} alt="logo" width={150} height={150} />
                <p>Crate and Barter you nfts here</p>
                <div className={Style.sidebar_social}>
                    <a href="#">
                        <TiSocialFacebook />
                    </a>
                    <a href="#">
                        <TiSocialTwitter />
                    </a>
                    <a href="#">
                        <TiSocialInstagram />
                    </a>

                </div>
            </div>

            <div className={Style.sidebar_menu}>
                <div>
                    <div className={Style.sidebar_menu_box} onClick={() => openDiscoverMenu()} >
                        <p>Discover</p>
                        <TiArrowSortedDown />
                    </div>

                    {
                        openDiscover && (
                            <div className={Style.sidebar_discover}>
                                {discover.map((el, i) => (
                                    <p key={i + 1}>
                                        <Link href={{ pathname: `${el.link}` }}>{el.name}</Link>
                                    </p>
                                ))}
                            </div>
                        )
                    }
                </div>

                {/* Help Center */}
                <div>
                    <div className={Style.sidebar_menu_box} onClick={() => openHelpMenu()} >
                        <p>Help Center</p>
                        <TiArrowSortedDown />
                    </div>

                    {
                        openHelp && (
                            <div className={Style.sidebar_help}>
                                {helpCenter.map((el, i) => (
                                    <p key={i + 1}>
                                        <Link href={{ pathname: `${el.link}` }}>{el.name}</Link>
                                    </p>
                                ))}
                            </div>
                        )
                    }
                </div>
            </div>

            <div className={Style.sidebar_button}>
                <Button btnName="Create" handleClick={() => { }} />
                <Button btnName="Connect Wallet" handleClick={() => { }} />
            </div>
        </div>
    );
};

export default SideBar;
