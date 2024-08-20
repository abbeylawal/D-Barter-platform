import React, { useCallback, useState, useMemo, useContext } from 'react';
import { useDropzone } from 'react-Dropzone';
import Image from 'next/image';
import Style from './DropZone.module.css';
import images from "../../../assets/img";


const DropZone = ({
    title,
    heading,
    subHeading,
    name,
    description,
    fileSize,
    category,
    swapCategory,
    uploadToIPFS,
    setImage
}) => {

    const [fileUrl, setFileUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);

    const onDrop = useCallback(async (acceptedFile) => {
        setIsUploading(true);
        setError(null);
        try {
            const url = await uploadToIPFS(acceptedFile[0]);
            setFileUrl(url);
            setImage(url);
        } catch (err) {
            console.error("Error uploading file:", err);
            setError("Failed to upload file. Please try again.");
        } finally {
            setIsUploading(false);
        }
    }, [uploadToIPFS, setImage]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
        maxSize: 5000000,
    });

    return (
        <div className={Style.DropZone}>
            <div className={Style.DropZone_box} {...getRootProps()}>
                <input {...getInputProps()
                } />
                <div className={Style.DropZone_box_input}>
                    <p>upload File Type: JPEG, PNG, WEBP MAX 100MB</p>
                    <div className={Style.DropZone_box_input_img}>
                        <Image
                            className={Style.DropZone_box_input_img_img}
                            src={images.upload}
                            alt="upload"
                            width={150}
                            height={150}
                            objectFit='contain'
                        />
                    </div>
                    <p>{heading}</p>
                    <p>{subHeading}</p>
                </div>
            </div>
            {fileUrl && (
                <aside className={Style.DropZone_box_aside} >
                    <div className={Style.DropZone_box_aside_box}>
                        <Image
                            className={Style.DropZone_box_input_img_img}
                            src={fileUrl}
                            alt="uploaded nft"
                            width={200}
                            height={200}
                            layout="responsive"
                        />
                        <div className={Style.DropZone_box_aside_box_preview}>
                            <div className={Style.DropZone_box_aside_box_preview_one}>
                                <p>
                                    <span>NFT Name:{" "}</span>
                                    {name || ""}
                                </p>
                            </div>
                            <div className={Style.DropZone_box_aside_box_preview_two}>
                                <p>
                                    <span>Description:{" "}</span>
                                    {description || ""}
                                </p>
                            </div>
                            <div className={Style.DropZone_box_aside_box_preview_three}>
                                <p>
                                    <span>Category:</span>
                                    {category || ""}
                                </p>
                                <p>
                                    <span>Swap:</span>
                                    {swapCategory || ""}
                                </p>
                            </div>


                        </div>
                    </div>
                </aside>
            )}
        </div>
    )
};

export default DropZone;
