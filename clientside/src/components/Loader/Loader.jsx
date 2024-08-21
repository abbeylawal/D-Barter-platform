import React from 'react'
import Style from "./Loader.module.css";

const Loader = () => {
    return (
        <div className={Style.Loader}>
            <div className={Style.Loader_box}>
                <div className={Style.Loader_spinner}></div>
            </div>
        </div>
    )
}

export default Loader;