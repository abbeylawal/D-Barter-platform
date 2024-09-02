import React, {useContext} from 'react';
import Image from 'next/image';
import Style from "./Notification.module.css";
import images from "../../../assets/img";
import userData from "../../../assets/Data/userData.json";


import { NFTMarketplaceContext } from "../../../../SmartContract/Context/NFTMarketplaceContext";

const Notification = () => {

    // Smart Contract Section
    const { currentAccount, connectWallet, openError } = useContext(NFTMarketplaceContext);

    // Ensure currentAccount exists and has userId
    const userId = currentAccount ? currentAccount.userId : 1;
    const user = userData[userId]

    return (
        <div className={Style.notification}>
            <p>Notification</p>
            <div className={Style.notification_box}>
                <div className={Style.notification_box_img}>
                    <Image src={user.userImage} alt="profile image"
                        width={50}
                        height={50}
                        style={{ borderRadius: '50%' }}
                    />
                </div>
                <div className={Style.notification_box_info}>
                    <h4>{user.name} </h4>
                    <p>Offer on your product..</p>
                    <small>3 minutes ago</small>
                </div>
                <span className={Style.notification_box_new}>

                </span>
            </div>
        </div>
    );
};

export default Notification;
