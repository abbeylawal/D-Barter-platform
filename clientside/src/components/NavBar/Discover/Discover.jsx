import React from 'react';
import Link from 'next/link';

import Style from "./Discover.module.css";

const Discover = () => {
    // ------ Discover Nav Menu -----
    const discover = [
        {
            name: "Collection",
            link: "searchPage"
        },
        {
            name: "Author Profile",
            link: "author"
        },
        {
            name: "Create Nft",
            link: "upload-products"
        },
        {
            name: "Account Setting",
            link: "account"
        },
        {
            name: "Connect Wallet",
            link: "connectWallet"
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
