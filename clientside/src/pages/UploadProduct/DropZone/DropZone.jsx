import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-Dropzone';
import Image from 'next/image';
import Style from './DropZone.module.css';

const DropZone = ({ onFilesAdded }) => {
    const [files, setFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles.slice(0, 6)]);
        onFilesAdded(acceptedFiles);
    }, [onFilesAdded]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
        maxSize: 5000000,
    });

    return (
        <div {...getRootProps({ className: Style.DropZone })}>
            <input {...getInputProps()} />
            <p>Drag & drop some files here, or click to select files</p>
            <div className={Style.preview}>
                {files.map((file, index) => (
                    <div key={index} className={Style.previewImage}>
                        <Image src={URL.createObjectURL(file)} alt={`Preview ${index}`} layout="fill" objectFit="cover" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DropZone;
