import React from 'react';
import {BsCircleFill} from "react-icons/bs";
import images from "../../img";
import Image from "next/image";
import Style from "./Category.module.css";

const Category = () => {
    // const CategoryArray = [1,2,3,4,5,6];
    const CategoryArray = [
        images.creatorbackground1,
        images.creatorbackground10, 
        images.creatorbackground2, 
        images.creatorbackground11, 
        images.creatorbackground4,
        images.creatorbackground5];
        
    return (
        <div className={Style.box_category}>
            <div className={Style.category}>
                {CategoryArray.map((el, i) => (
                    <div className={Style.category_box}>
                        <Image
                            src={el}
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