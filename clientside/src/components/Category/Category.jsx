import React from 'react';
import {BsCircleFill} from "react-icons/bs";
import images from "../../img";
import Image from "next/image";
import Style from "./Category.module.css";

const Category = () => {
    const CategoryArray = [1,2,3,4,5,6];
    return (
        <div className={Style.box_category}>
            <div className={Style.category}>
                {CategoryArray.map((el, i) => (
                    <div className={Style.category_box}>
                        <Image
                            src={images.creatorbackground3}
                            className={Style.category_box_img}
                            alt='creator Background'
                            width={350}
                            height={150}
                            objectFit="cover"
                        />

                        <div className={Style.category_box_title}>
                            <span>
                                <BsCircleFill/>
                            </span>
                            <div className={Style.category_box_title_info}>
                                <h4> Entrainment </h4>
                                <small>1995 NFTS</small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default Category;