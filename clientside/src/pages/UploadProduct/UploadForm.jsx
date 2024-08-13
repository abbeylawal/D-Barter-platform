import React, { useState } from 'react';
import { MdOutlineHttp, MdOutlineAttachFile } from "react-icons/md";
import { FaPercent } from "react-icons/fa";
// import { AiTwotonePropertySafety } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import Image from "next/image";

// Internal imports
import DropZone from './DropZone/DropZone';
import formStyle from "../AccountPage/ProfileForm/ProfileForm.module.css";
import Style from './UploadForm.module.css';
import images from "../../assets/img";
import { Button } from "../../components/componentsIndex.js";

const UploadForm = () => {
    const [active, setActive] = useState(0);
    const [itemName, setItemName] = useState("");
    const [website, setWebsite] = useState("");
    const [description, setDescription] = useState("");
    const [royalties, setRoyalties] = useState("");
    const [fileSize, setFileSize] = useState("");
    const [category, setCategory] = useState("");

    const categoryArray = [
        {
            images: images.NFT_image_1,
            category: "Fashion",
        },
        {
            images: images.NFT_image_2,
            category: "Fashion",
        },
        {
            images: images.NFT_image_3,
            category: "Fashion",
        },
        {
            images: images.NFT_image_4,
            category: "Fashion",
        },
        {
            images: images.NFT_image_5,
            category: "Fashion",
        },
        {
            images: images.NFT_image_6,
            category: "Fashion",
        },
    ];

    return (
        <div className={Style.upload}>
            <DropZone
                title="JPG, PNG, WEBM, MAX 100MB"
                heading="Drag & drop file"
                subHeading="or Browse media on your device"
                itemName={itemName}
                description={description}
                fileSize={fileSize}
                category={category}
                swap={category}
                image={images.upload}
            />

            <div className={Style.upload_box}>
                <div className={Style.Form_box_input}>
                    <label htmlFor="nft">Item Name</label>
                    <div className={formStyle.inputField}>
                        <input
                            type="text"
                            placeholder="Enter item name"
                            className={formStyle.inputField}
                            onChange={(e) => setItemName(e.target.value)}
                            value={itemName}
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
                            <img src={el.images} alt={el.category} className={Style.slider_image} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Add buttons or additional fields here */}
            <br />
            <br />
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
