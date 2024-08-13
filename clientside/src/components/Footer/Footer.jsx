import React from 'react';
import styles from './Footer.module.css';
import {
    TiSocialFacebook,
    TiSocialTwitter,
    TiSocialLinkedin,
    TiSocialInstagram
} from "react-icons/ti";
import { Discover, HelpCenter } from '../NavBar/index';
const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <div className={styles.footerSection}>
                    <h3>About Us</h3>
                    <p>Barter Trade System by Muftau Lawal</p>
                    <h3>Follow Us</h3>
                        <a href="#"><TiSocialFacebook className={styles.icon} /></a>
                        <a href="#"><TiSocialTwitter className={styles.icon} /></a>
                        <a href="#"><TiSocialLinkedin className={styles.icon} /></a>
                        <a href="#"><TiSocialInstagram className={styles.icon} /></a>
                </div>
                <div className={styles.footerSection}>
                    <h3>Pages</h3>
                    <Discover />
                </div>
                <div className={styles.footerSection}>
                    <h3>Help Center</h3>
                    <HelpCenter />
                </div>
                <div className={styles.footerSection}>
                    <h3>Contact</h3>
                    <p>Email: contact@mail</p>
                    <p>Phone: + --------</p>
                </div>
            </div>
            <div className={styles.footerBottom}>
                <p>&copy; 2024 Barter Easy - Muftau Lawal. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
