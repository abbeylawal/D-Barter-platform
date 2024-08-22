import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import Style from './Error.module.css';
import images from "../../assets/img";

import { NFTMarketplaceContext } from '../../../SmartContract/Context/NFTMarketplaceContext';

const Error = () => {

    const { error, setOpenError } = useContext(NFTMarketplaceContext)
    return (
        <div className={Style.error} onClick={() => setOpenError(false)}>
            <div className={Style.errorBox}>
                <div className={Style.errorBoxInfo}>
                    <Image
                        className={Style.errorImage}
                        src={images.Error}
                        alt='error'
                        width={350}
                        height={250}
                        objectFit='cover'
                    />
                    {/* <p>{ error }</p> */}
                    {/* <p> Error </p> */}

                    <h2 className={Style.errorTitle}>Error</h2>
                    <p className={Style.errorMessage}>{error || 'An unexpected error occurred.'}</p>
                </div>
            </div>
        </div>
    )
}

export default Error;