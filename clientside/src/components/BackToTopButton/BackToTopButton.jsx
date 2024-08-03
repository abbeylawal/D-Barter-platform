import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import Style from './BackToTopButton.module.css'; // Assuming you have a CSS module for styling

const BackToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <div className={Style.backToTop}>
            {isVisible && (
                <div onClick={scrollToTop} className={Style.backToTopButton}>
                    <FaArrowUp />
                </div>
            )}
        </div>
    );
};

export default BackToTopButton;
