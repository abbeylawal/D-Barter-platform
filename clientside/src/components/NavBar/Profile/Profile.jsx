import React from 'react';
import Image from 'next/image';
import { MdHelpCenter } from 'react-icons/md';
import { TbDownloadOff, TbDownload } from 'react-icons/tb';
import { FaUserAlt, FaRegImage, FaUserEdit } from 'react-icons/fa';
import Link from 'next/link';


import Style from "./Profile.module.css";
import images from '../../../assets/img';
import users from '../../../assets/Data/userData.json';


const Profile = () => {
    // const { accountsMappingRef } = useContext(NFTMarketplaceContext);

    // const userId = accountsMappingRef 
    // const user = user[userId]

    const user = users[3]

    return (
        <div className={Style.profile}>
            <div className={Style.profile_account}>
                <Image
                    src={user.userImage}
                    alt={`${user.creatorName}'s profile`}
                    width={50}
                    height={50}
                    className={Style.profile_account_img}
                />

                <div className={Style.profile_account_info}>
                    <p>{user.creatorName}</p>
                    <small>{user.walletAddress}</small>
                </div>
            </div>

            {/*======= PROFILE MENU===== */}
            <div className={Style.profile_menu}>
                <div className={Style.profile_menu_one}>
                    <div className={Style.profile_menu_one_item}>
                        <FaUserAlt />
                        <p>
                            <Link href={{ pathname: '/account' }}>My Profile</Link>
                        </p>
                    </div>

                    <div className={Style.profile_menu_one_item}>
                        <FaRegImage />
                        <p>
                            <Link href={{ pathname: '/my-items' }}>My Items</Link>
                        </p>
                    </div>
                </div>

                <div className={Style.profile_menu_two}>
                    <div className={Style.profile_menu_one_item}>
                        <MdHelpCenter />
                        <p>
                            <Link href={{ pathname: "/help" }} > Help
                            </Link>
                        </p>
                    </div>
                    <div className={Style.profile_menu_one_item}>
                        <TbDownload />
                        <p>
                            <Link href={{ pathname: "/disconnect" }} > Disconnect</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
