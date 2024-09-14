import React, {useEffect, useContext} from 'react';
import { BsCircleFill } from "react-icons/bs";
import Image from "next/image";
import { useRouter } from 'next/router';
import Style from "./Category.module.css";
import images from "../../assets/img/";
// SMART CONTRACT
import { NFTMarketplaceContext } from "../../../SmartContract/Context/NFTMarketplaceContext";

const Category = () => {
    const router = useRouter();
    const categories =  [
        { image: images.fashionCategory, name: 'Fashion', count: '1995 NFTS' },
        { image: images.electronicsCategory, name: 'Electronics', count: '320 NFTS' },
        { image: images.computerCategory, name: 'Computers', count: '1780 NFTS' },
        { image: images.gadgetsCategory, name: 'Gadgets', count: '250 NFTS' },
        { image: images.mobileCategory, name: 'Mobile', count: '500 NFTS' },
        { image: images.artCategory, name: 'Art', count: '1340 NFTS' }
    ];

    const { currentAccount } = useContext(NFTMarketplaceContext);
    

    // Only redirect if currentAccount exists
    const handleCategoryClick = (categoryName) => {
        if (currentAccount) { // Check if currentAccount is present
            router.push({
                pathname: '/searchPage',
                query: { category: categoryName, scroll: 'filter' },
            });
        }
    };

    return (
        <div className={Style.box_category}>
            <div className={Style.category}>
                {categories.map((category, i) => (
                    <div
                        className={Style.category_box}
                        key={i}
                        onClick={() => handleCategoryClick(category.name)}
                    >
                        <Image
                            src={category.image}
                            className={Style.category_box_img}
                            alt={`${category.name} Background`}
                            width={200}
                            height={170}
                            objectFit="contain"
                            layout="intrinsic"
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