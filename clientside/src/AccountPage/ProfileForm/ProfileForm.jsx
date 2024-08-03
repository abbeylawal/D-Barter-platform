import React from 'react';
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineHttp, MdOutlineContentCopy } from 'react-icons/md';
import { TiSocialFacebook, TiSocialTwitter, TiSocialInstagram } from "react-icons/ti";
import { Button } from "../../components/componentsIndex";

import Style from "./ProfileForm.module.css";

const ProfileForm = () => {
    return (
        <div className={Style.Form}>
            <div className={Style.Form_box}>
                <form>
                    <div className={Style.Form_box_input}>
                        <label htmlFor="username">Username</label>
                        <div className={Style.inputField}>
                            <input
                                type='text'
                                id='username'
                                placeholder='Enter username'
                            />
                        </div>
                    </div>

                    <div className={Style.Form_box_input}>
                        <label htmlFor="email">Email</label>
                        <div className={Style.inputField}>
                            <HiOutlineMail className={Style.icon} />
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div className={Style.Form_box_input}>
                        <label htmlFor="bio">Bio</label>
                        <div className={Style.inputField}>
                            <textarea
                                id="bio"
                                cols={30}
                                rows={6}
                                placeholder="Enter your bio"
                            />
                        </div>
                    </div>

                    <div className={Style.Form_box_input}>
                        <label htmlFor="website">Website</label>
                        <div className={Style.inputField}>
                            <MdOutlineHttp className={Style.icon} />
                            <input
                                type="url"
                                id="website"
                                placeholder="Enter your website"
                            />
                        </div>
                    </div>

                    <div className={Style.Form_box_input_social}>
                        <div className={Style.Form_box_input}>
                            <label htmlFor="facebook">Facebook</label>
                            <div className={Style.inputField}>
                                <TiSocialFacebook className={Style.icon} />
                                <input
                                    type="url"
                                    id="facebook"
                                    placeholder="Facebook profile link"
                                />
                            </div>
                        </div>

                        <div className={Style.Form_box_input}>
                            <label htmlFor="twitter">Twitter</label>
                            <div className={Style.inputField}>
                                <TiSocialTwitter className={Style.icon} />
                                <input
                                    type="url"
                                    id="twitter"
                                    placeholder="Twitter profile link"
                                />
                            </div>
                        </div>

                        <div className={Style.Form_box_input}>
                            <label htmlFor="instagram">Instagram</label>
                            <div className={Style.inputField}>
                                <TiSocialInstagram className={Style.icon} />
                                <input
                                    type="url"
                                    id="instagram"
                                    placeholder="Instagram profile link"
                                />
                            </div>
                        </div>
                    </div>

                    <div className={Style.Form_box_input}>
                        <label htmlFor="wallet">Wallet Address</label>
                        <div className={Style.inputField}>
                            <MdOutlineHttp className={Style.icon} />
                            <input
                                type="text"
                                id="wallet"
                                placeholder="0xEA122....."
                            />
                            <div className={Style.icon_copy}>
                                <MdOutlineContentCopy />
                            </div>
                        </div>
                    </div>
                    <div className={Style.saveProfile_Btn} style={{ marginTop: '2rem' }}>
                        <Button btnName="Save Profile" handleClick={() => { }} />
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ProfileForm;
