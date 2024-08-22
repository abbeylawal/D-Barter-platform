import React from 'react';
import Link from 'next/link';
import Style from './HelpCenter.module.css';

const HelpCenter = () => {
    const helpCenter = [
        {
            name: "About",
            link: "about"
        },
        {
            name: "Register",
            link: "/auth",
            query: { mode: "register" }
        },
        {
            name: "Sign In",
            link: "/auth"
        },
        {
            name: "Track Exchange",
            link: "track-exchange"
        }
    ];

    return (
        <div className={Style.box}>
            {helpCenter.map((el, i) => (
                <div className={Style.helpCenter} key={i + 1}>
                    <Link href={{ pathname: el.link, query: el.query }}>
                        {el.name}
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default HelpCenter;
