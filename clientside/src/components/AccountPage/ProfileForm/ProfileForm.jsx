import React from 'react';
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineHttp, MdOutlineContent } from 'react-icons/md';
import { TiSocialFacebook, TiSocialTwitter, TiSocialInstagram } from "react-icons/ti";
import Button from "./Button/Button";

import Style from "./ProfileForm.module.css";

const ProfileForm = () => {
    return (
        <div className={Style.Form}>
            <div className={Style.Form_box}>
                <form className={Style.Form_box_input}>
                    <label htmlFor="username">Username</label>
                    <div className={Style.inputField}>
                        <input type="text" id="username" placeholder="Enter your username" />
                    </div>

                    <label htmlFor="email">Email</label>
                    <div className={Style.inputField}>
                        <HiOutlineMail className={Style.icon} />
                        <input type="email" id="email" placeholder="Enter your email" />
                    </div>

                    <label htmlFor="website">Website</label>
                    <div className={Style.inputField}>
                        <MdOutlineHttp className={Style.icon} />
                        <input type="url" id="website" placeholder="Enter your website" />
                    </div>

                    <label htmlFor="bio">Bio</label>
                    <div className={Style.inputField}>
                        <MdOutlineContent className={Style.icon} />
                        <input type="text" id="bio" placeholder="Enter your bio" />
                    </div>

                    <label htmlFor="facebook">Facebook</label>
                    <div className={Style.inputField}>
                        <TiSocialFacebook className={Style.icon} />
                        <input type="url" id="facebook" placeholder="Facebook profile link" />
                    </div>

                    <label htmlFor="twitter">Twitter</label>
                    <div className={Style.inputField}>
                        <TiSocialTwitter className={Style.icon} />
                        <input type="url" id="twitter" placeholder="Twitter profile link" />
                    </div>

                    <label htmlFor="instagram">Instagram</label>
                    <div className={Style.inputField}>
                        <TiSocialInstagram className={Style.icon} />
                        <input type="url" id="instagram" placeholder="Instagram profile link" />
                    </div>

                    <Button btnName="Save Profile" handleClick={() => { }} />
                </form>
            </div>
        </div>
    );
};

export default ProfileForm;
