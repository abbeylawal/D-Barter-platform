import React, { useState, useEffect, useContext } from 'react';
import Image from "next/image";
import Link from "next/link";

import { MdNotifications } from 'react-icons/md';
import { BsSearch } from 'react-icons/bs';
import { CgMenuLeft, CgMenuRight } from 'react-icons/cg';

import Style from './NavBar.module.css';
import { Discover, HelpCenter, ToggleTheme, Notification, Profile, SideBar } from './index';
import { Button, Error } from "../componentsIndex";
import images from "../../assets/img";
import users from "../../assets/Data/userData.json"


import { NFTMarketplaceContext } from "../../../SmartContract/Context/NFTMarketplaceContext";

const NavBar = () => {
    const [activeMenu, setActiveMenu] = useState('');
    const [openSideMenu, setOpenSideMenu] = useState(false);

    const handleMenuEnter = (menu) => {
        setActiveMenu(menu);
    };

    const handleMenuLeave = () => {
        setActiveMenu('');
    };

    const toggleSideBar = () => {
        setOpenSideMenu(!openSideMenu);
    };

    // Smart Contract Section
    const { currentAccount, connectWallet, openError } = useContext(NFTMarketplaceContext);

   // Ensure currentAccount exists and has userId
    const userId = currentAccount ? currentAccount.userId : 1;
    const user = users[userId]

    return (
        <div className={Style.navbar}>
            {/* navbar container */}
            <div className={Style.navbar_container}>
                {/* navbar left */}
                <div className={Style.navbar_container_left}>
                    <div className={Style.logo}>
                        <a href="/" style={{ cursor: 'pointer' }}>
                            <Image
                                src={images.logo}
                                alt='BARTER MARKET PLACE'
                                width={100}
                                height={100}
                            />
                        </a>
                    </div>
                    <div className={Style.navbar_container_left_box_input}>
                        <div className={Style.navbar_container_left_box_input_box}>
                            <input type="text" placeholder="Search Item" />
                            <BsSearch onClick={() => { }} className={Style.search_icon} />
                        </div>
                    </div>
                </div>

                {/* navbar Right */}
                <div className={Style.navbar_container_right}>
                    {/* Discover Menu */}
                    <div
                        className={Style.navbar_container_right_discover}
                        onMouseEnter={() => handleMenuEnter('discover')}
                        onMouseLeave={handleMenuLeave}
                    >
                        <p>Discover</p>
                        {activeMenu === 'discover' && (
                            <div className={Style.navbar_container_right_discover_box}>
                                <Discover />
                            </div>
                        )}
                    </div>

                    {/* HelpCenter Menu */}
                    <div
                        className={Style.navbar_container_right_help}
                        onMouseEnter={() => handleMenuEnter('help')}
                        onMouseLeave={handleMenuLeave}
                    >
                        <p>Help</p>
                        {activeMenu === 'help' && (
                            <div className={Style.navbar_container_right_help_box}>
                                <HelpCenter />
                            </div>
                        )}
                    </div>

                    {/* Toggle Theme */}
                    <div className={Style.navbar_container_right_toggle}>
                        <ToggleTheme />
                    </div>

                    {/* Notification */}
                    <div
                        className={Style.navbar_container_right_notify}
                        onMouseEnter={() => handleMenuEnter('notification')}
                        onMouseLeave={handleMenuLeave}
                    >
                        <MdNotifications className={Style.notify} />
                        {activeMenu === 'notification' && <Notification />}
                    </div>

                    {/* Create Button */}
                    <div className={Style.navbar_container_right_button}>
                        {currentAccount == "" ?
                            (<Button btnName="Connect" handleClick={() => connectWallet()} />) :
                            (
                                <Link href={{ pathname: "/upload-products" }} >
                                    <Button btnName="Create" handleClick={() => { }} />
                                </Link>
                            )}
                    </div>

                    {/* User Profile */}
                    <div
                        className={Style.navbar_container_right_profile_box}
                        onMouseEnter={() => handleMenuEnter('profile')}
                        onMouseLeave={handleMenuLeave}
                    >
                        <div className={Style.navbar_container_right_profile}>
                            <Image
                                // src={images[`user${userId}`]}
                                src={user.userImage}
                                alt="Profile"
                                width={40}
                                height={40}
                                className={Style.navbar_container_right_profile}
                            />
                            {activeMenu === 'profile' && <Profile />}
                        </div>
                    </div>

                    {/* Menu Button */}
                    <div className={Style.navbar_container_right_menuBtn}>
                        <CgMenuRight className={Style.menuIcon} onClick={toggleSideBar} />
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            {openSideMenu && (
                <div className={Style.SideBar}>
                    <SideBar setOpenSideMenu={setOpenSideMenu} />
                </div>
            )}

            {openError && <Error/> }
        </div>
    );
};

export default NavBar;