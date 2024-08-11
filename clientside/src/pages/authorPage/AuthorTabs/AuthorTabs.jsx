import React, { useState } from 'react';
import { TiArrowSortedDown, TiArrowSortedUp, TiTick } from "react-icons/ti";
import Style from "./AuthorTabs.module.css";

const AuthorTabs = ({ activeTab, setActiveTab }) => {
    const [openList, setOpenList] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState("Most Recent");

    const listArray = [
        "Most Recent",
        "Curated",
        "Most Appreciated",
        "Most Discussed",
        "Most Viewed"
    ];

    const openTab = (tab) => {
        setActiveTab(tab);
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
                        {['Collectables', 'Created', 'Listed', 'Liked'].map((tab, index) => (
                            <button
                                key={index}
                                className={activeTab === tab.toLowerCase() ? Style.active : ""}
                                onClick={() => openTab(tab.toLowerCase())}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={Style.AuthorTabs_box_right}>
                    <div
                        className={Style.AuthorTabs_box_right_para}
                        onClick={openDropDown}
                    >
                        <p>{selectedMenu}</p>
                        {openList ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
                    </div>
                    {openList && (
                        <div className={Style.dropdown}>
                            {listArray.map((item, index) => (
                                <div
                                    key={index}
                                    className={Style.dropdown_item}
                                    onClick={() => selectMenu(item)}
                                >
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