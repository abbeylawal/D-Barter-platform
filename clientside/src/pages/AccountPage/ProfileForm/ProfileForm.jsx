import React, { useState, useContext, useEffect } from 'react';
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineHttp, MdOutlineContentCopy } from 'react-icons/md';
import { TiSocialFacebook, TiSocialTwitter, TiSocialInstagram } from "react-icons/ti";
import { Button } from "../../../components/componentsIndex";

import Style from "./ProfileForm.module.css";
import userData from "../../../assets/Data/userData.json";
import { NFTMarketplaceContext } from "../../../../SmartContract/Context/NFTMarketplaceContext";

const ProfileForm = () => {
    const { currentAccount } = useContext(NFTMarketplaceContext);
    const userId = currentAccount ? currentAccount.userId : 1;

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        bio: '',
        website: '',
        facebook: '',
        twitter: '',
        instagram: '',
        wallet: ''
    });

    const [isEditable, setIsEditable] = useState(false);

    // Dynamically update formData when userId changes
    useEffect(() => {
        const user = userData[userId];
        setFormData({
            username: user.userName,
            email: user.email,
            bio: user.bio,
            website: user.Website || '',
            facebook: user.Facebook || '',
            twitter: user.Twitter || '',
            instagram: user.Instagram || '',
            wallet: currentAccount ? currentAccount.address : ''
        });
    }, [userId, currentAccount]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = () => {
        if (isEditable) {
            // Save the form data to a JSON file
            const filePath = '/assets/Data/nft-profile.json';
            // fs.writeFileSync(filePath, JSON.stringify(formData, null, 2));
            console.log("Profile data saved:", formData);

            // Show a success message (optional)
            alert("Profile updated successfully!");

            // Switch back to non-editable mode
            setIsEditable(false);
        } else {
            // Switch to editable mode
            setIsEditable(true);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // You might want to show a "Copied!" message to the user here
    };

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
                                value={formData.username}
                                onChange={handleChange}
                                disabled={!isEditable}
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
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditable}
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
                                value={formData.bio}
                                onChange={handleChange}
                                disabled={!isEditable}
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
                                value={formData.website}
                                onChange={handleChange}
                                disabled={!isEditable}
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
                                    value={formData.facebook}
                                    onChange={handleChange}
                                    disabled={!isEditable}
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
                                    value={formData.twitter}
                                    onChange={handleChange}
                                    disabled={!isEditable}
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
                                    value={formData.instagram}
                                    onChange={handleChange}
                                    disabled={!isEditable}
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
                                value={formData.wallet}
                                onChange={handleChange}
                                disabled={!isEditable}
                            />
                            <div
                                className={Style.icon_copy}
                                onClick={() => copyToClipboard(formData.wallet)}
                            >
                                <MdOutlineContentCopy />
                            </div>
                        </div>
                    </div>
                    <div className={Style.saveProfile_Btn} style={{ marginTop: '2rem' }}>
                        <Button
                            btnName={isEditable ? "Upload Profile" : "Edit Profile"}
                            handleClick={handleSubmit}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileForm;
