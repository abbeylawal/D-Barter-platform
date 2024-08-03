import React, { useState } from 'react';
import { BsSearch, BsArrowRight} from 'react-icons/bs';
import Style from './SearchBar.module.css';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearch = () => {
        if (onSearch) {
            onSearch(query);
        }
    };

    
    return (
        <div className={Style.SearchBar}>
            <div className={Style.SearchBar_box}>
             <input
                 type="text"
                 value={query}
                 onChange={handleInputChange}
                 placeholder="Search NFTs..."
                 className={Style.searchInput}
             />
            <BsSearch onClick={handleSearch} className={Style.SearchBar_box_icon}/>

            </div>
        </div>
    )
};

export default SearchBar;
