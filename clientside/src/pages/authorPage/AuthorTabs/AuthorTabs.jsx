import React, { useState } from 'react';
import Image from 'next/image';
import { TiArrowSortedDown, TiArrowSortedUp, TiTick } from "react-icons/ti";
import Style from "./AuthorTabs.module.css";

const AuthorTabs = ({ setCollectables, setCreated, setListed, setLike }) => {
    const [openList, setOpenList] = useState(false);
    const [activeBtn, setActiveBtn] = useState(0);
    const [selectedMenu, setSelectedMenu] = useState("Most Recent");

    const listArray = [
        "Curated",
        "Most Appreciated",
        "Most Discussed",
        "Most Viewed"
    ];

    const openTab = (e, index) => {
        setActiveBtn(index);
        if (index === 1) setCollectables();
        if (index === 2) setCreated();
        if (index === 3) setListed();
        if (index === 4) setLike();
    };

    const openDropDown = () => {
        setOpenList(!openList);
    };

    const selectMenu = (item) => {
        setSelectedMenu(item);
        setOpenList(false);
    };

    return (
        <div className={Style.AuthorTabs}>
            <div className={Style.AuthorTabs_box}>
                <div className={Style.AuthorTabs_box_left}>
                    <div className={Style.AuthorTabs_box_left_btn}>
                        <button className={`${activeBtn === 1 ? Style.active : ""}`}
                            onClick={(e) => openTab(e, 1)}>Collectables</button>
                        <button className={`${activeBtn === 2 ? Style.active : ""}`}
                            onClick={(e) => openTab(e, 2)}>Created</button>
                        <button className={`${activeBtn === 3 ? Style.active : ""}`}
                            onClick={(e) => openTab(e, 3)}>Listed</button>
                        <button className={`${activeBtn === 4 ? Style.active : ""}`}
                            onClick={(e) => openTab(e, 4)}>Liked</button>
                    </div>
                </div>

                <div className={Style.AuthorTabs_box_right}>
                    <div
                        className={Style.AuthorTabs_box_right_para}
                        onClick={() => openDropDown()}>
                        <p>{selectedMenu}</p>
                        {openList ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
                    </div>
                    {openList && (
                        <div className={Style.dropdown}>
                            {listArray.map((item, index) => (
                                <div
                                    key={index}
                                    className={Style.dropdown_item}
                                    onClick={() => selectMenu(item)}>
                                    {item} {selectedMenu === item && <TiTick />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthorTabs;