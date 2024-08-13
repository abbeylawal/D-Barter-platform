import React, { useCallback, useState, useMemo, useContext } from 'react';
import { useDropzone } from 'react-Dropzone';
import Image from 'next/image';
import Style from './DropZone.module.css';
import images from "../../../assets/img"




const DropZone = ({
    title,
    heading,
    subHeading,
    itemName,
    description,
    fileSize,
    category,
    swapCategory,
    properties,
    image,
}) => {

    const [fileUrl, setFileUrl] = useState(null);

    const onDrop = useCallback(async (acceptedFile) => {
        setFileUrl(acceptedFile[0])
    })

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
                    <p>title</p>
                    <div className={Style.DropZone_box_input_img}>
                        <Image
                            className={Style.DropZone_box_input_img_img}
                            src={image}
                            alt="upload"
                            width={100}
                            height={100}
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
                            src={images.NFT_image_1}
                            alt="uploaded nft"
                            width={200}
                            height={200}
                        />
                        <div className={Style.DropZone_box_aside_box_preview}>
                            <div className={Style.DropZone_box_aside_box_preview_one}>
                                <p>
                                    <span>NFT Name:</span>
                                    {itemName || ""}
                                </p>
                            </div>
                            <div className={Style.DropZone_box_aside_box_preview_two}>
                                <p>
                                    <span>Description:</span>
                                    {description || ""}
                                </p>
                            </div>
                            <div className={Style.DropZone_box_aside_box_preview_three}>
                                <p>
                                    <span>Properties:</span>
                                    {properties || ""}
                                </p>
                                <p>
                                    <span>FileSize:</span>
                                    {fileSize || ""}
                                </p>
                                <p>
                                    <span>Category:</span>
                                    {category || ""}
                                </p>
                                <p>
                                    <span>Swap with:</span>
                                    {swapCategory || ""}
                                </p>
                            </div>


                        </div>
                    </div>
                </aside>
            )}
        </div>
    )
}

export default DropZone


// const DropZone = ({ onFilesAdded }) => {
//     const [files, setFiles] = useState([]);

//     const onDrop = useCallback((acceptedFiles) => {
//         setFiles((prevFiles) => [...prevFiles, ...acceptedFiles.slice(0, 6)]);
//         onFilesAdded(acceptedFiles);
//     }, [onFilesAdded]);

//     const { getRootProps, getInputProps } = useDropzone({
//         onDrop,
//         accept: 'image/*',
//         maxSize: 5000000,
//     });

//     return (
//         <div {...getRootProps({ className: Style.DropZone })}>
//             <input {...getInputProps()} />
//             <p>Drag & drop some files here, or click to select files</p>
//             <div className={Style.preview}>
//                 {files.map((file, index) => (
//                     <div key={index} className={Style.previewImage}>
//                         <Image src={URL.createObjectURL(file)} alt={`Preview ${index}`} layout="fill" objectFit="cover" />
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default DropZone;
