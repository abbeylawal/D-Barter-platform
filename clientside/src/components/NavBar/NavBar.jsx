import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";

import { MdNotifications } from 'react-icons/md';
import { BsSearch } from 'react-icons/bs';
import { CgMenuLeft, CgMenuRight } from 'react-icons/cg';

import Style from './NavBar.module.css';
import { Discover, HelpCenter, ToggleTheme, Notification, Profile, SideBar } from './index';
import { Button } from "../componentsIndex";
import images from "../../asserts/img";

const NavBar = () => {
    const [activeMenu, setActiveMenu] = useState('');
    const [openSideMenu, setOpenSideMenu] = useState(false);

    const handleMenuClick = (menu) => {
        setActiveMenu(activeMenu === menu ? '' : menu);
    };

    const toggleSideBar = () => {
        setOpenSideMenu(!openSideMenu);
    };

    return (
        <div className={Style.navbar}>
            {/* navbar container */}
            <div className={Style.navbar_container}>
                {/* navbar left */}
                <div className={Style.navbar_container_left}>
                    <div className={Style.logo}>
                        <Image 
                        src={images.logo} 
                        alt='BARTER MARKET PLACE' 
                        href="/"
                        width={100} 
                        height={100} />
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
                    <div className={Style.navbar_container_right_discover}>
                        <p onClick={() => handleMenuClick('discover')}>Discover</p>
                        {activeMenu === 'discover' && (
                            <div className={Style.navbar_container_right_discover_box}>
                                <Discover />
                            </div>
                        )}
                    </div>

                    {/* HelpCenter Menu */}
                    <div className={Style.navbar_container_right_help}>
                        <p onClick={() => handleMenuClick('help')}>Help Center</p>
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
                    <div className={Style.navbar_container_right_notify}>
                        <MdNotifications className={Style.notify} onClick={() => handleMenuClick('notification')} />
                        {activeMenu === 'notification' && <Notification />}
                    </div>

                    {/* Create Button */}
                    <div className={Style.navbar_container_right_button}>
                        <Button btnName="Create" handleClick={() => { }} />
                    </div>

                    {/* User Profile */}
                    <div className={Style.navbar_container_right_profile_box}>
                        <div className={Style.navbar_container_right_profile}>
                            <Image
                                src={images.user1}
                                alt="Profile"
                                width={40}
                                height={40}
                                onClick={() => handleMenuClick('profile')}
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
        </div>
    );
};

export default NavBar;