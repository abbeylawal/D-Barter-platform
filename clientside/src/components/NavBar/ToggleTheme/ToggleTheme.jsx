import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import Style from './ToggleTheme.module.css';

const ToggleTheme = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('darkMode');
            if (savedTheme) {
                setDarkMode(savedTheme === 'true');
            }
        }
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
        if (typeof window !== 'undefined') {
            localStorage.setItem('darkMode', darkMode);
        }
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode(prevMode => !prevMode);
    };

    return (
        <div className={Style.toggleTheme}>
            <input
                className={Style.dark_mode_input}
                type='checkbox'
                id='dark-mode-toggle'
                onChange={toggleTheme}
                checked={darkMode}
            />
            <label className={Style.dark_mode_label} htmlFor='dark-mode-toggle'>
                <FaSun className={Style.icon} />
                <FaMoon className={Style.icon} />
                <div className={Style.ball}></div>
            </label>
        </div>
    );
};

export default ToggleTheme;
