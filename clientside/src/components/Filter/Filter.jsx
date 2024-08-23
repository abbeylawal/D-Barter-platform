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


import Style from "./Filter.module.css";

const Filter = () => {
    const [filter, setFilter] = useState(false);
    const [image, setImage] = useState(true);
    const [video, setVideo] = useState(true);
    const [music, setMusic] = useState(true);

    const toggleFilter = () => setFilter(!filter);
    const toggleImage = () => setImage(!image);
    const toggleVideo = () => setVideo(!video);
    const toggleMusic = () => setMusic(!music);

    return (
        <div className={Style.filter}>
            <div className={Style.filter_box}>
                <div className={Style.filter_box_left}>
                    <button onClick={() => { }}>Fashion</button>
                    <button onClick={() => { }}>Arts</button>
                    <button onClick={() => { }}>Gadgets</button>
                    <button onClick={() => { }}>Accessories</button>
                    <button onClick={() => { }}>Electronics</button>
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




// ====================
// import React, { useState, useEffect } from "react";
// import {
//     FaFilter,
//     FaAngleDown,
//     FaAngleUp,
//     FaWallet,
//     FaImages,
//     FaVideo,
//     FaMusic,
//     FaUserAlt,
// } from "react-icons/fa";
// import { AiFillCloseCircle } from "react-icons/ai";
// import { MdVerified } from "react-icons/md";
// import { TiTick } from 'react-icons/ti';

// import Style from "./Filter.module.css";

// const Filter = ({ nftData, onFilterChange }) => {
//     const [filter, setFilter] = useState(false);
//     const [categories, setCategories] = useState([]);
//     const [selectedCategories, setSelectedCategories] = useState([]);

//     useEffect(() => {
//         // Extract unique categories from nftData
//         const uniqueCategories = [...new Set(nftData.map(nft => nft.Category))];
//         setCategories(uniqueCategories);
//     }, [nftData]);

//     const toggleFilter = () => setFilter(!filter);

//     const toggleCategory = (category) => {
//         setSelectedCategories(prev => 
//             prev.includes(category)
//                 ? prev.filter(c => c !== category)
//                 : [...prev, category]
//         );
//     };

//     useEffect(() => {
//         // Call the onFilterChange prop whenever selectedCategories changes
//         onFilterChange(selectedCategories);
//     }, [selectedCategories, onFilterChange]);

//     return (
//         <div className={Style.filter}>
//             <div className={Style.filter_box}>
//                 <div className={Style.filter_box_left}>
//                     {categories.map((category, index) => (
//                         <button 
//                             key={index} 
//                             onClick={() => toggleCategory(category)}
//                             className={selectedCategories.includes(category) ? Style.active : ''}
//                         >
//                             {category}
//                         </button>
//                     ))}
//                 </div>

//                 <div className={Style.filter_box_right}>
//                     <div className={Style.filter_box_right_box} onClick={toggleFilter}>
//                         <FaFilter />
//                         <span>Filter</span>
//                         {filter ? <FaAngleUp /> : <FaAngleDown />}
//                     </div>
//                 </div>
//             </div>

//             {filter && (
//                 <div className={Style.filter_box_items}>
//                     <div className={Style.filter_box_items_box}>
//                         <div className={Style.filter_box_items_box_item}>
//                             <FaWallet />
//                             <span>Popular</span>
//                             <AiFillCloseCircle />
//                         </div>
//                     </div>

//                     <div className={Style.filter_box_items_box}>
//                         <div className={Style.filter_box_items_box_item_trans}>
//                             <FaImages />
//                             <small>Images</small>
//                             <TiTick />
//                         </div>
//                     </div>

//                     <div className={Style.filter_box_items_box}>
//                         <div className={Style.filter_box_items_box_item_trans}>
//                             <FaVideo />
//                             <small>Videos</small>
//                             <AiFillCloseCircle />
//                         </div>
//                     </div>

//                     <div className={Style.filter_box_items_box}>
//                         <div className={Style.filter_box_items_box_item_trans}>
//                             <FaMusic />
//                             <small>Music</small>
//                             <AiFillCloseCircle />
//                         </div>
//                     </div>

//                     <div className={Style.filter_box_items_box}>
//                         <div className={Style.filter_box_items_box_item}>
//                             <FaUserAlt />
//                             <small>Verified</small>
//                             <MdVerified />
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Filter;