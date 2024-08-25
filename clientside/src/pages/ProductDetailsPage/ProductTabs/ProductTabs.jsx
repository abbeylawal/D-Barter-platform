import React from 'react';
import Image from 'next/image';
import { MdVerified } from 'react-icons/md';
import Style from './ProductTabs.module.css';

const ProductTabs = ({ dataTab, icon, activeTab }) => {
    // Determine the label based on the active tab
    const getLabel = () => {
        switch (activeTab) {
            case 'creators history':
                return 'Offer by';
            case 'provenance':
                return 'Bartered by';
            case 'owner':
                return 'Current owner';
            default:
                return '';
        }
    };

    return (
        <div className={Style.ProductTabs}>
            {dataTab.map((el, i) => (
                <div key={i + 1} className={Style.ProductTabs_box}>
                    <Image
                        src={el.image}
                        alt="profile image"
                        width={40}
                        height={40}
                        className={Style.ProductTabs_box_img}
                    />

                    <div className={Style.ProductTabs_box_info}>
                        <span>
                            {/* Display the dynamic label */}
                            {getLabel()} <span>{el.name}</span>
                            <small>
                                <MdVerified />
                            </small>
                            {icon}

                            {/* Render the button only if the active tab is "Creators History" */}
                            {activeTab === 'creators history' && (
                                <button
                                    disabled
                                    style={{
                                        backgroundColor: '#e0e0e0',
                                        color: '#9e9e9e',
                                        position: "relative",
                                        // right: "-6rem",
                                        // marginRight: "2rem",
                                        border: 'none',
                                        padding: '5px 10px',
                                        cursor: 'not-allowed',
                                        opacity: '0.6',
                                        transition: 'all 0.3s ease',
                                        borderRadius: '4px',
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#c0c0c0';
                                        e.target.style.color = '#ffffff';
                                        e.target.style.opacity = '1';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = '#e0e0e0';
                                        e.target.style.color = '#9e9e9e';
                                        e.target.style.opacity = '0.6';
                                    }}
                                >
                                    View Offer
                                </button>
                            )}
                        </span>

                        <small>{el.date} </small>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductTabs;
