import React from 'react';
import Style from './MainSection.module.css';
import Image from 'next/image';
import {Button} from "../componentsIndex";
import images from "../../img";

const MainContent = () => {
    return (
        <div className={Style.mainsection}>
            <div className={Style.mainsection_box}>
                <div className={Style.mainsection_box_left}>
                    <h1>Create 🐼 and Trade NFTs 🔄 </h1>
                    <p>
                        Dive into the exciting world of digital assets, where you can explore unique creations, gather your favorite collectibles, and engage in seamless trading with others. NFTs (Non-Fungible Tokens) offer a revolutionary way to own and exchange digital content, ensuring authenticity and ownership through blockchain technology.
                    </p>
                    <Button btnName="Start your search" handleClick={() => { }} />
                </div>
                <div className={Style.mainsection_box_right}>
                    <Image src={images.hero} alt="Main Section" 
                    width={600} 
                    height={600} 
                    />
                </div>
            </div>
        </div>
    )
};

export default MainContent;