import React, { useState, useEffect } from 'react';
import { BsSearch, BsArrowRight } from 'react-icons/bs';
import Style from './SearchBar.module.css';

const SearchBar = ({ onHandleSearch, onClearSearch }) => {
    const [search, setSearch] = useState("");
    const [searchItem, setSearchItem] = useState(search);

    useEffect(() => {
        const timer = setTimeout(() => setSearch(searchItem), 1000);
        return () => clearTimeout(timer);
    }, [searchItem]);

    useEffect(() => {
        if (search) {
            onHandleSearch(search);
        } else {
            onClearSearch();
        }
    }, [search, onHandleSearch, onClearSearch]);

    return (
        <div className={Style.SearchBar}>
            <div className={Style.SearchBar_box}>
                <BsSearch className={Style.SearchBar_box_icon} />
                <input
                    className={Style.searchInput}
                    type="text"
                    placeholder="Search items"
                    onChange={(e) => setSearchItem(e.target.value)}
                    value={searchItem}
                />
                <BsArrowRight className={Style.SearchBar_box_icon} />
            </div>
        </div>
    );
};

export default SearchBar;
