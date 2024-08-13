import React from 'react';
import { BsCircleFill } from "react-icons/bs";
import Image from "next/image";
import Style from "./Category.module.css";
import images from "../../assets/img/";

const Category = () => {
    const categories = [
        { image: images.fashionCategory, name: 'Fashion', count: '1995 NFTS' },
        { image: images.electronicsCategory, name: 'Electronics', count: '320 NFTS' },
        { image: images.computerCategory, name: 'Computers', count: '1780 NFTS' },
        { image: images.gadgetsCategory, name: 'Gadgets', count: '250 NFTS' },
        { image: images.mobileCategory, name: 'Mobiles', count: '500 NFTS' },
        { image: images.artCategory, name: 'Arts', count: '1340 NFTS' }
    ];

    return (
        <div className={Style.box_category}>
            <div className={Style.category}>
                {categories.map((category, i) => (
                    <div className={Style.category_box} key={i}>
                        <Image
                            src={category.image}
                            className={Style.category_box_img}
                            alt={`${category.name} Background`}
                            width={170}
                            height={150}
                            objectFit="contain"
                        />

                        <div className={Style.category_box_title}>
                            <span>
                                <BsCircleFill />
                            </span>
                            <div className={Style.category_box_title_info}>
                                <h4>{category.name}</h4>
                                <small>{category.count}</small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Category;
