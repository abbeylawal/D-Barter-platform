import React, { useState, useEffect, useContext } from 'react';
import Style from './MainSection.module.css';
import Image from 'next/image';
import { Button } from "../componentsIndex";
import images from "../../assets/img";
import Link from "next/link";
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

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to change the image index, cycling through the array
  const changeImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageArray.length);
  };

  const { currentAccount, connectWallet, openError } = useContext(NFTMarketplaceContext);
  const userId = currentAccount ? currentAccount.userId : 1;

  return (
    <div className={Style.mainsection}>
      <div className={Style.mainsection_box}>
        <div className={Style.mainsection_box_left}>
          <h1>{titleData}</h1>
          <p>{titleCover}</p>
          <div className={Style.mainsection_box_left_btn_box} >
            {currentAccount === "" || !currentAccount ? (
              <Button btnName="Connect" handleClick={() => connectWallet()} />
            ) : (
              <Link href={{ pathname: "/upload-products" }}>
                <Button btnName="Create" handleClick={() => { }} />
              </Link>
            )}

            {/* Search Page */}
            {
              currentAccount &&
              <Link href="/searchPage">
                <Button btnName="Start your search" handleClick={() => { }} />
              </Link>
            }
          </div>
        </div>
        <div className={Style.mainsection_box_right}>
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
      {/* end mainsection_ box */}

      <div className={Style.started}>
        <p className={Style.started_bold_text}>Getting started</p>
        <p className={Style.started_slim_text}>Barter Easy Work Flow</p>
        <div className={Style.started_items}>
          <div className={Style.itemWrapper}>
            <div className={Style.started_items_item}>
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36">
                <path style={{ stroke: 'none', fillRule: 'nonzero', fill: '#e0e0e0', fillOpacity: 1 }} d="M24.7969 14.6719c.4375-.4414.4375-1.1524 0-1.5938-.4414-.4375-1.1524-.4375-1.5938 0L16.5 19.7851l-2.9531-2.957c-.4414-.4375-1.1524-.4375-1.5938 0-.4375.4414-.4375 1.1524 0 1.5938l3.75 3.75a1.1246 1.1246 0 0 0 1.5938 0Zm0 0" />
                <path style={{ stroke: 'none', fillRule: 'evenodd', fill: '#e0e0e0', fillOpacity: 1 }} d="M18.8086.957a2.6005 2.6005 0 0 0-1.6172 0L4.8164 4.9688C3.7344 5.3202 3 6.3241 3 7.4648V15c0 9.2852 5.6563 16.0586 14.1016 19.246a2.5853 2.5853 0 0 0 1.7968 0C27.3438 31.0587 33 24.2853 33 15V7.4648a2.6182 2.6182 0 0 0-1.8164-2.496Zm-.9219 2.1368a.3738.3738 0 0 1 .2266 0l12.375 4.0117c.1601.0547.2617.1992.2617.3593V15c0 8.1914-4.9219 14.2227-12.6445 17.1367a.2815.2815 0 0 1-.211 0C10.172 29.2227 5.25 23.1914 5.25 15V7.4648c0-.1601.1016-.3046.2617-.3593Zm0 0" />
              </svg>
            </div>
            <br />
            <p>Connect your wallet</p>
          </div>
          <div className={Style.itemWrapper}>
            <div className={Style.started_items_item}>
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36">
                <path style={{ stroke: 'none', fillRule: 'evenodd', fill: '#bdbdbd', fillOpacity: 1 }} d="M4.125 3C2.6758 3 1.5 4.1758 1.5 5.625v5.25c0 1.4492 1.1758 2.625 2.625 2.625h27.75c1.4492 0 2.625-1.1758 2.625-2.625v-5.25C34.5 4.1758 33.3242 3 31.875 3Zm27.75 2.25H4.125c-.207 0-.375.168-.375.375v5.25c0 .207.168.375.375.375h27.75c.207 0 .375-.168.375-.375v-5.25c0-.207-.168-.375-.375-.375Zm0 0" />
                <path style={{ stroke: 'none', fillRule: 'nonzero', fill: '#bdbdbd', fillOpacity: 1 }} d="M4.125 15c.621 0 1.125.504 1.125 1.125v14.25c0 .207.168.375.375.375h24.75c.207 0 .375-.168.375-.375v-14.25c0-.621.504-1.125 1.125-1.125S33 15.504 33 16.125v14.25C33 31.8242 31.8242 33 30.375 33H5.625C4.1758 33 3 31.8242 3 30.375v-14.25C3 15.504 3.504 15 4.125 15Zm0 0" />
                <path style={{ stroke: 'none', fillRule: 'nonzero', fill: '#bdbdbd', fillOpacity: 1 }} d="M14.625 17.25c-.621 0-1.125.504-1.125 1.125s.504 1.125 1.125 1.125h6.75c.621 0 1.125-.504 1.125-1.125s-.504-1.125-1.125-1.125Zm0 0" />
              </svg>
            </div>
            <br />
            <p>Create product nfts</p>
          </div>
          <div className={Style.itemWrapper}>
            <div className={Style.started_items_item}>
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 31">
                <path style={{ stroke: 'none', fillRule: 'evenodd', fill: '#bdbdbd', fillOpacity: 1 }} d="M2.832 2.9219c-.2148 0-.3867.1758-.3867.3906v24.375c0 .2148.1719.3906.3867.3906h4.9453l13.332-14.1875c1.0548-1.121 2.8165-1.1445 3.8985-.0508l8.5469 8.6407V3.3125c0-.2148-.1719-.3906-.3867-.3906Zm30.336 27.5156H2.832c-1.5039 0-2.7226-1.2305-2.7226-2.75V3.3125c0-1.5195 1.2187-2.75 2.7226-2.75h30.336c1.5039 0 2.7226 1.2305 2.7226 2.75v24.375c0 1.5195-1.2187 2.75-2.7226 2.75ZM22.8008 15.5156 10.996 28.0781H33.168c.2148 0 .3867-.1758.3867-.3906v-1.871L23.3594 15.5077a.388.388 0 0 0-.5586.0078Zm-9.4688-4.3398c0 1.5195-1.2187 2.75-2.7226 2.75-1.5 0-2.7188-1.2305-2.7188-2.75 0-1.5196 1.2188-2.75 2.7188-2.75 1.5039 0 2.7226 1.2304 2.7226 2.75Zm2.336 0c0 2.8242-2.2657 5.1094-5.0586 5.1094-2.789 0-5.0547-2.2852-5.0547-5.1094s2.2656-5.1094 5.0547-5.1094c2.793 0 5.0586 2.2852 5.0586 5.1094Zm0 0" />
              </svg>
            </div>
            <br />
            <p>List on market place</p>
          </div>
          <div className={Style.itemWrapper}>
            <div className={Style.started_items_item}>
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36">
                <path style={{ stroke: 'none', fillRule: 'evenodd', fill: '#bdbdbd', fillOpacity: 1 }} d="M30.9453.5a16.7245 16.7245 0 0 0-11.4687 4.5508l-2.0274 1.914a35.9135 35.9135 0 0 0-2.3984 2.4805h-7.836c-.957 0-1.8437.5-2.3359 1.3203L.668 17.7891c-.1952.3242-.2226.7226-.0702 1.0664.1523.3476.4609.5976.828.6758l7.1134 1.496c.0586.0782.125.1485.1992.2188l3.1054 2.914 2.9102 3.1016c.0703.0742.1406.1406.2188.1992l1.496 7.1133c.0782.3672.3282.6758.6758.8281a1.158 1.158 0 0 0 1.0664-.0703l7.0235-4.211a2.7222 2.7222 0 0 0 1.3203-2.3358v-7.836a36.8748 36.8748 0 0 0 2.4844-2.3984l1.9101-2.0274A16.7411 16.7411 0 0 0 35.5 5.0508l-.004-1.8281C35.496 1.7187 34.2774.5 32.7774.5Zm-6.7226 22.3398a39.89 39.89 0 0 1-1.582 1.1172l-5.2813 3.5196 1.0547 5.0156 5.621-3.3711c.1172-.0703.1876-.1992.1876-.336ZM8.5234 18.6406l3.5196-5.2812a34.8776 34.8776 0 0 1 1.1172-1.582H7.2148a.3952.3952 0 0 0-.3359.1913L3.508 17.586ZM21.0781 6.75a14.3862 14.3862 0 0 1 9.8672-3.918h1.832c.211 0 .3868.1758.3868.3907v1.828c0 3.672-1.3985 7.2032-3.9141 9.8712l-1.9102 2.0273a34.7388 34.7388 0 0 1-5.996 5.0664l-5.1133 3.4102-2.711-2.8906c-.0195-.0157-.0351-.0352-.0547-.0508l-2.8906-2.7149 3.4102-5.1172c1.457-2.1796 3.1523-4.1914 5.0625-5.9921Zm5.4766 5.0273c0 1.2891-1.043 2.332-2.332 2.332-1.2891 0-2.332-1.0429-2.332-2.332 0-1.289 1.0429-2.332 2.332-2.332 1.289 0 2.332 1.043 2.332 2.332ZM9.4453 32c1.3985-1.3984 1.3985-4.043 0-5.4453-1.4023-1.3985-4.0469-1.3985-5.4453 0-1.879 1.8828-2.246 6.0703-2.3164 7.3789a.3609.3609 0 0 0 .3828.3828C3.375 34.2461 7.5625 33.879 9.4454 32Zm0 0" />
                <text x="100" y="100" text-anchor="middle" fill="#fff" font-size="12" dy=".3em">make and accept barter offers</text>
              </svg>
            </div>
            <br />
            <p>make and accept barter offers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;