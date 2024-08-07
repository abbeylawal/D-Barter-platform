import React, { useState } from 'react';
import DropZone from './DropZone/DropZone';
import Style from './UploadForm.module.css';

const UploadForm = () => {
    const [formData, setFormData] = useState({
        productName: '',
        location: '',
        category: '',
        usage: '',
        swapCategory: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFilesAdded = (files) => {
        console.log(files);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <form className={Style.form} onSubmit={handleSubmit}>
            <DropZone onFilesAdded={handleFilesAdded} />
            <div className={Style.formGroup}>
                <label htmlFor="productName">Product Name</label>
                <input type="text" id="productName" name="productName" value={formData.productName} onChange={handleInputChange} required />
            </div>
            <div className={Style.formGroup}>
                <label htmlFor="location">Location</label>
                <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} required />
            </div>
            <div className={Style.formGroup}>
                <label htmlFor="category">Category</label>
                <input type="text" id="category" name="category" value={formData.category} onChange={handleInputChange} required />
            </div>
            <div className={Style.formGroup}>
                <label htmlFor="usage">Usage</label>
                <select id="usage" name="usage" value={formData.usage} onChange={handleInputChange} required>
                    <option value="">Select usage</option>
                    <option value="brand-new">Brand New</option>
                    <option value="fairly-used">Fairly Used</option>
                </select>
            </div>
            <div className={Style.formGroup}>
                <label htmlFor="swapCategory">Swap Category</label>
                <input type="text" id="swapCategory" name="swapCategory" value={formData.swapCategory} onChange={handleInputChange} required />
            </div>
            <div className={Style.formActions}>
                <button type="submit" className={Style.button}>Upload</button>
                <button type="button" className={Style.button}>Preview</button>
            </div>
        </form>
    );
};

export default UploadForm;
