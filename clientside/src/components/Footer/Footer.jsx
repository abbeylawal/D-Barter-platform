import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.footer_container}>
                <div className={styles.footer_section}>
                    <h3>About Us</h3>
                    <p>Barter Trade System by Muftau Lawal</p>
                </div>
                <div className={styles.footer_section}>
                    <h3>Contact</h3>
                    <p>Email: contact@example.com</p>
                    <p>Phone: +123 456 7890</p>
                </div>
                <div className={styles.footer_section}>
                    <h3>Follow Us</h3>
                    <div className={styles.social_links}>
                        <a href="#">Facebook</a>
                        <a href="#">Twitter</a>
                        <a href="#">Instagram</a>
                    </div>
                </div>
            </div>
            <div className={styles.footer_bottom}>
                <p>&copy; 2024 Bater Easy - Muftau Lawal. All rights reserved.</p>
            </div>
        </div>
    );
};

export default Footer;
