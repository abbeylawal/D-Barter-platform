import React from 'react';
import Image from 'next/image';
import { MdVerified } from 'react-icons/md';
import Style from './ProductTabs.module.css';

const ProductTabs = ({ dataTab, icon }) => {
    return (
        <div className={Style.ProductTabs}>
            {dataTab.map((el, i) => (
                <div key={i + 1} className={Style.ProductTabs_box}>
                    <Image
                        src={el}
                        alt="profile image"
                        width={40}
                        height={40}
                        className={Style.ProductTabs_box_img}
                    />

                    <div className={Style.ProductTabs_box_info}>
                        <span>
                            Offer by $760 by <span>Kevlin Smith</span>
                            {/* <small>
                                <MdVerified />
                            </small> */}
                            {icon}
                        </span>

                        <small>Jun 14 - 4:12 PM</small>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductTabs;