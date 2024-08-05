import React from 'react';
import PropTypes from 'prop-types';
import Style from './Banner.module.css';
import Image from 'next/image';

const Banner = ({ bannerImage }) => {
    return (
        <div className={Style.banner}>
            <div className={Style.banner_img}>
                <Image 
                    src={bannerImage}
                    alt="background image"
                    width={1600}
                    height={200}
                    objectFit='cover'
                />
            </div>
            {/* <div className={Style.banner_img_mobile}>
                <Image 
                    src={bannerImage}
                    alt="background image"
                    width={1600}
                    height={900}
                    objectFit='cover'
                />

            </div> */}
            {/* <div className={Style.content}>
                <h1>Welcome to Our NFT Marketplace</h1>
                <p>Discover, create, and sell extraordinary NFTs</p>
            </div> */}
        </div>
    );
};

Banner.propTypes = {
    bannerImage: PropTypes.string.isRequired,
};

export default Banner;
