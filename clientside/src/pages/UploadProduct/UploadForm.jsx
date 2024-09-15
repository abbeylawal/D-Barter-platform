import React, { useState, useRef } from 'react';
import { MdOutlineHttp, MdOutlineAttachFile } from "react-icons/md";
import { FaPercent } from "react-icons/fa";
import { AiTwoTonePropertySafety } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import Image from "next/image";
import { useRouter } from "next/router";

// Internal imports
import DropZone from './DropZone/DropZone';
import formStyle from "../AccountPage/ProfileForm/ProfileForm.module.css";
import Style from './UploadForm.module.css';
import images from "../../assets/img";
import { Button, Loader } from "../../components/componentsIndex.js";

const UploadForm = ({ uploadToIPFS, createNFT }) => {
    const [price, setPrice] = useState("");
    const [active, setActive] = useState(0);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [fileSize, setFileSize] = useState("");
    const [category, setCategory] = useState("");
    const [swapCategories, setSwapCategories] = useState([]);
    const [image, setImage] = useState("null");
    const [loading, setLoading] = useState(false);

    const router = useRouter()
    const dropZoneRef = useRef(null);

    const categoryArray = [
        {
            image: images.fashionCategory,
            category: "Fashion",
        },
        {
            image: images.gadgetsCategory,
            category: "Gadgets",
        },
        {
            image: images.computerCategory,
            category: "Computers",
        },
        {
            image: images.mobileCategory,
            category: "Mobile",
        },
        {
            image: images.electronicsCategory,
            category: "Electronics",
        },
        {
            image: images.artCategory,
            category: "Art",
        },
    ];

    const handleSwapCategoryClick = (category) => {
        if (swapCategories.includes(category)) {
            setSwapCategories(swapCategories.filter(cat => cat !== category));
        } else if (swapCategories.length < 3) {
            setSwapCategories([...swapCategories, category]);
        }
    };

    const scrollToDropZone = () => {
        if (dropZoneRef.current) {
            dropZoneRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    // New handler function for the Upload button
    const handleUploadClick = async () => {
        try {
            scrollToDropZone();

            // Indicate that uploading has started
            
            // Await the asynchronous createNFT function
            await createNFT(name, image, description, router, category, swapCategories);

        } catch (err) {
            console.error("Error creating NFT:", err);
            setError("Failed to upload NFT. Please try again.");
            // Optionally, display the error message to the user
        }
    };


    return (
        <div className={Style.upload}>
            <div ref={dropZoneRef}> {/* Add the ref to the DropZone div */}
                <DropZone
                    title="JPG, PNG, WEBM, MAX 100MB"
                    heading="Drag & drop file"
                    subHeading="or Browse media on your device"
                    name={name}
                    description={description}
                    fileSize={fileSize}
                    category={category}
                    swapCategories={swapCategories}
                    setImage={setImage}
                    uploadToIPFS={uploadToIPFS}
                />
            </div>

            <div className={Style.upload_box}>
                <div className={Style.Form_box_input}>
                    <label htmlFor="nft">Item Name</label>
                    <div className={formStyle.inputField}>
                        <input
                            type="text"
                            placeholder="Enter item name"
                            className={formStyle.inputField}
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    </div>
                </div>
            </div>

            <div className={formStyle.Form_box_input}>
                <label htmlFor="Description">Description</label>
                <div className={formStyle.inputField}>
                    <textarea
                        id="description"
                        cols={30}
                        rows={6}
                        placeholder="Something about your product"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                    />
                </div>
            </div>

            <div className={formStyle.Form_box_input}>
                <label htmlFor="name"> Choose Collection</label>
                <p className={Style.upload_box_input_para}>
                    Choose a collection category
                </p>

                <div className={Style.upload_box_slider_div}>
                    {categoryArray.map((el, i) => (
                        <div
                            className={`${Style.upload_box_slider} ${active === i + 1 ? Style.active : ""}`}
                            key={i + 1}
                            onClick={() => { setActive(i + 1); setCategory(el.category); }}
                        >

                            <div className={Style.upload_box_slider_box}>
                                <div className={Style.upload_box_slider_box_img}>
                                    <Image
                                        className={Style.upload_box_slider_box_img_img}
                                        src={el.image}
                                        alt="Category Image"
                                        height={70}
                                        width={70}
                                    />
                                </div>
                                <div className={Style.upload_box_slider_box_img_icon}>
                                    {active === i + 1 && <TiTick />}
                                </div>
                            </div>
                            <p> {el.category}</p>

                        </div>
                    ))}
                </div>
            </div>

            <div className={formStyle.Form_box_input}>
                <label htmlFor="name"> Select Swap Category</label>
                <p className={Style.upload_box_input_para}>
                    Choose two to three preferred swap category
                </p>

                <div className={Style.upload_box_slider_div}>
                    {categoryArray.map((el, i) => (
                        <div
                            className={`${Style.upload_box_slider} ${swapCategories.includes(el.category) ? Style.active : ""}`}
                            key={i + 1}
                            onClick={() => handleSwapCategoryClick(el.category)}
                        >
                            <div className={Style.upload_box_slider_box_group}>
                                <div> {el.category}</div>
                                <div className={Style.upload_box_slider_box_img_icon}>
                                    {swapCategories.includes(el.category) && <TiTick />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={Style.upload_box_btn}>
                <Button btnName="Upload" handleClick={handleUploadClick}
                    classStyle={Style.upload_box_btn_style}
                />
                <Button
                    btnName="Preview"
                    handleClick={scrollToDropZone}
                    classStyle={Style.upload_box_btn_style}
                />
            </div>
        </div>
    );
};

export default UploadForm;
