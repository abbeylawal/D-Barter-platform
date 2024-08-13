import React, { useState, useEffect, useContext } from 'react';
import Style from './MainSection.module.css';
import Image from 'next/image';
import { Button } from "../componentsIndex";
import images from "../../assets/img";
import { NFTMarketplaceContext } from "../../../SmartContract/Context/NFTMarketplaceContext";

const MainContent = () => {
    const { titleData, titleCover } = useContext(NFTMarketplaceContext);

    // Array of images to be displayed
    const imageArray = [
        images.hero,
        images.nft_image_2,
        images.nft_image_3,
        images.nft_image_1,
    ];

    // State to track the current image index
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Function to change the image index, cycling through the array
    const changeImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageArray.length);
    };

    return (
        <div className={Style.mainsection}>
            <div className={Style.mainsection_box}>
                <div className={Style.mainsection_box_left}>
                    {/* Dynamic title coming from context */}
                    <h1>{titleData}</h1>
                    {/* Dynamic cover description from context */}
                    <p>{titleCover}</p>
                    {/* A button to start search or any other primary action */}
                    <div className={Style.mainsection_box_left_btn_box} >
                    <Button btnName="Explore" handleClick={changeImage} />
                    <Button btnName="Start your search" handleClick={changeImage} />
                    </div>
                </div>
                <div className={Style.mainsection_box_right}>
                    {/* Display the current image from the array */}
                    <Image
                        src={imageArray[currentImageIndex]}
                        alt={`NFT Image ${currentImageIndex + 1}`}
                        width={600}
                        height={600}
                        layout="responsive"
                        objectFit="cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default MainContent;