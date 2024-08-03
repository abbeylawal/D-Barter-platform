import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import Style from './ToggleTheme.module.css';

const ToggleTheme = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={Style.toggleTheme} onClick={toggleTheme}>
            {darkMode ? <FaSun className={Style.icon} /> : <FaMoon className={Style.icon} />}
        </div>
    );
};

export default ToggleTheme;
