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
import { Button } from "../../components/componentsIndex.js";

const UploadForm = ({ uploadToIPFS, createNFT }) => {
    const [price, setPrice] = useState("");
    const [active, setActive] = useState(0);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [fileSize, setFileSize] = useState("");
    const [category, setCategory] = useState("");
    const [swapCategories, setSwapCategories] = useState([]);
    const [image, setImage] = useState("null");


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
                <Button btnName="Upload" handleClick={async () =>
                    createNFT(name, image, description, router, category, swapCategories)
                }
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




// const UploadForm = () => {
//     const [formData, setFormData] = useState({
//         productName: '',
//         location: '',
//         category: '',
//         usage: '',
//         swapCategory: '',
//     });

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleFilesAdded = (files) => {
//         console.log(files);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log(formData);
//     };

//     return (
//         <form className={Style.form} onSubmit={handleSubmit}>
//             <DropZone onFilesAdded={handleFilesAdded} />
//             <div className={Style.formGroup}>
//                 <label htmlFor="productName">Product Name</label>
//                 <input type="text" id="productName" name="productName" value={formData.productName} onChange={handleInputChange} required />
//             </div>
//             <div className={Style.formGroup}>
//                 <label htmlFor="location">Location</label>
//                 <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} required />
//             </div>
//             <div className={Style.formGroup}>
//                 <label htmlFor="category">Category</label>
//                 <input type="text" id="category" name="category" value={formData.category} onChange={handleInputChange} required />
//             </div>
//             <div className={Style.formGroup}>
//                 <label htmlFor="usage">Usage</label>
//                 <select id="usage" name="usage" value={formData.usage} onChange={handleInputChange} required>
//                     <option value="">Select usage</option>
//                     <option value="brand-new">Brand New</option>
//                     <option value="fairly-used">Fairly Used</option>
//                 </select>
//             </div>
//             <div className={Style.formGroup}>
//                 <label htmlFor="swapCategory">Swap Category</label>
//                 <input type="text" id="swapCategory" name="swapCategory" value={formData.swapCategory} onChange={handleInputChange} required />
//             </div>
//             <div className={Style.formActions}>
//                 <button type="submit" className={Style.button}>Upload</button>
//                 <button type="button" className={Style.button}>Preview</button>
//             </div>
//         </form>
//     );
// };

// export default UploadForm;
