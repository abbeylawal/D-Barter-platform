import React from 'react';
import Link from 'next/link';

import Style from "./Discover.module.css";

const Discover = () => {
    // ------ Discover Nav Menu -----
    const discover = [
        {
            name: "Collection",
            link: "collection"
        },
        {
            name: "Search",
            link: "searchPage"
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
            link: "account"
        },
        {
            name: "Connect Wallet",
            link: "connect-wallet"
        }
    ];

    return (
        <div>
            {discover.map((el, i)=> (
                <div key={i +1} className={Style.discover}>
                    <Link href={{ pathname: `${el.link}` }}>{el.name}</Link>
                </div>
            ))}
        </div>
    );
};

export default Discover;
