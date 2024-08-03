import React, { useState } from 'react';
import {
    BsFillAlarmFill,
    BsFillCalendarDateFill,
    BsCalendar3,
} from "react-icons/bs";

// Internal import
import Style from "./Collection.module.css";
import DaysComponent from "./DaysComponents/DaysComponents";

const Collection = () => {
    const [popular, setPopular] = useState(true);
    const [following, setFollowing] = useState(false);
    const [news, setNews] = useState(false);

    const CardArray = [1, 2, 3, 4, 5, 6, 7, 8];
    const followingArray = [1, 2, 3, 4];
    const newsArray = [1, 2, 3, 4, 5, 6];

    const openPopular = () => {
        if (!popular) {
            setPopular(true);
            setFollowing(false);
            setNews(false);
        }
    };

    const openFollower = () => {
        if (!following) {
            setPopular(false);
            setFollowing(true);
            setNews(false);
        }
    };

    const openNews = () => {
        if (!news) {
            setPopular(false);
            setFollowing(false);
            setNews(true);
        }
    };

    return (
        <div className={Style.collection}>
            <div className={Style.collection_box}>
                <h2>Top Listed Creators</h2>
                <div className={Style.collection_cols}>
                    <div className={Style.collection_cols_btn}>
                        <button onClick={openPopular}>
                            <BsFillAlarmFill /> Last 24 hours
                        </button>
                        <button onClick={openFollower}>
                            <BsCalendar3 /> Last 7 days
                        </button>
                        <button onClick={openNews}>
                            <BsFillCalendarDateFill /> Last 30 days
                        </button>
                    </div>
                    {popular && (
                        <div className={Style.collection_box}>
                            {CardArray.map((el, i) => (
                                <DaysComponent key={i + 1} />
                            ))}
                        </div>
                    )}
                    {following && (
                        <div className={Style.collection_box}>
                            {followingArray.map((el, i) => (
                                <DaysComponent key={i + 1} />
                            ))}
                        </div>
                    )}
                    {news && (
                        <div className={Style.collection_box}>
                            {newsArray.map((el, i) => (
                                <DaysComponent key={i + 1} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Collection;