import React, {useState} from "react";
import {
    FaFilter,
    FaAngleDown,
    FaAngleUp,
    FaWallet,
    FaImages,
    FaVideo,
    FaMusic,
    FaUserAlt,
} from "react-icons/fa";
import { AiFillCloseCircle } from "react-icons/ai";
import { MdVerified } from "react-icons/md";
import { TiTick } from 'react-icons/ti';
import { useRouter } from "next/router";


import Style from "./Filter.module.css";

const Filter = ({ onCategoryChange }) => {
    const router = useRouter();
    const [filter, setFilter] = useState(false);
    const [image, setImage] = useState(true);
    const [video, setVideo] = useState(true);
    const [music, setMusic] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");

    const toggleFilter = () => setFilter(!filter);
    const toggleImage = () => setImage(!image);
    const toggleVideo = () => setVideo(!video);
    const toggleMusic = () => setMusic(!music);

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        if (typeof onCategoryChange === 'function') {
            onCategoryChange(category);
        }
        router.push({
            pathname: router.pathname,
            query: { ...router.query, category: category },
        }, undefined, { shallow: true });
    };

    const categories = ["All", "Fashion", "Art", "Computers", "Gadgets", "Mobile", "Electronics"];


    return (
        <div className={Style.filter}>
            <div className={Style.filter_box}>
                <div className={Style.filter_box_left}>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryClick(category)}
                            // className={activeCategory === category ? Style.active : ""}
                            className={`${Style.category_button} ${activeCategory === category ? Style.active_category : ''}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className={Style.filter_box_right}>
                    <div className={Style.filter_box_right_box} onClick={toggleFilter}>
                        <FaFilter />
                        <span>Filter</span>
                        {filter ? <FaAngleUp /> : <FaAngleDown />}
                    </div>
                </div>
            </div>

            {filter && (
                <div className={Style.filter_box_items}>
                    <div className={Style.filter_box_items_box}>
                        <div className={Style.filter_box_items_box_item}>
                            <FaWallet />
                            <span>Popular</span>
                            <AiFillCloseCircle />
                        </div>
                    </div>

                    <div className={Style.filter_box_items_box}>
                        <div
                            className={Style.filter_box_items_box_item_trans}
                            onClick={toggleImage}
                        >
                            <FaImages />
                            <small>Images</small>
                            {image ? <AiFillCloseCircle /> : <TiTick />}
                        </div>
                    </div>

                    <div className={Style.filter_box_items_box}>
                        <div
                            className={Style.filter_box_items_box_item_trans}
                            onClick={toggleVideo}
                        >
                            <FaVideo />
                            <small>Videos</small>
                            {video ? <AiFillCloseCircle /> : <TiTick />}
                        </div>
                    </div>

                    <div className={Style.filter_box_items_box}>
                        <div
                            className={Style.filter_box_items_box_item_trans}
                            onClick={toggleMusic}
                        >
                            <FaMusic />
                            <small>Music</small>
                            {music ? <AiFillCloseCircle /> : <TiTick />}
                        </div>
                    </div>

                    <div className={Style.filter_box_items_box}>
                        <div className={Style.filter_box_items_box_item}>
                            <FaUserAlt />
                            <small>Verified</small>
                            <MdVerified />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Filter;