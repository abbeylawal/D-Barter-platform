import React, { useState } from 'react';
import Style from './AuthForm.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AuthForm = ({ isLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handlePasswordToggle = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        if (isLogin) {
            console.log('Login:', { email, password });
        } else {
            console.log('Register:', { username, email, password, repeatPassword });
        }
    };

    return (
        <form onSubmit={handleSubmit} className={Style.authForm}>
            {!isLogin && (
                <div className={Style.inputGroup}>
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
            )}
            <div className={Style.inputGroup}>
                <label>Your e-mail</label>
                <input
                    type="email"
                    placeholder="Enter your e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className={Style.inputGroup}>
                <label>Password</label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <span onClick={handlePasswordToggle} className={Style.passwordToggle}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
            </div>
            {!isLogin && (
                <div className={Style.inputGroup}>
                    <label>Repeat password</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        required
                    />
                    <span onClick={handlePasswordToggle} className={Style.passwordToggle}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
            )}
            <div className={Style.actionButtons}>
                {isLogin ? (
                    <button type="submit" className={Style.loginButton}>Login</button>
                ) : (
                    <button type="submit" className={Style.registerButton}>Register</button>
                )}
                {isLogin && <button className={Style.forgotPassword}>Forgot password</button>}
            </div>
        </form>
    );
};

export default AuthForm;
