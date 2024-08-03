import React from 'react';
import PropTypes from 'prop-types';
import Style from './Banner.module.css';

const Banner = ({ bannerImage }) => {
    return (
        <div className={Style.banner} style={{ backgroundImage: `url(${bannerImage})` }}>
            <div className={Style.overlay}></div>
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
