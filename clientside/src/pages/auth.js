import React, { useState } from "react";
import AuthForm from "../components/AuthForm/AuthForm";
import Style from "../styles/auth.module.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className={Style.authContainer}>
      <div className={Style.formToggle}>
        <span
          onClick={() => setIsLogin(true)}
          className={isLogin ? Style.active : ""}
        >
          Login
        </span>
        <span
          onClick={() => setIsLogin(false)}
          className={!isLogin ? Style.active : ""}
        >
          Registration
        </span>
      </div>
      <AuthForm isLogin={isLogin} />
    </div>
  );
};

export default Auth;
