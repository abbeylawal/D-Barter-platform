import React from "react";
import { useRouter } from "next/router";
import AuthForm from "../components/AuthForm/AuthForm";
import Style from "../styles/auth.module.css";

const Auth = () => {
  const router = useRouter();
  const isLogin = router.query.mode !== "register";

  const handleToggle = (mode) => {
    router.push({
      pathname: "/auth",
      query: mode === "register" ? { mode: "register" } : {},
    });
  };

  return (
    <div className={Style.authContainer}>
      <div className={Style.formToggle}>
        <span
          onClick={() => handleToggle("login")}
          className={isLogin ? Style.active : ""}
        >
          Sign In
        </span>
        <span
          onClick={() => handleToggle("register")}
          className={!isLogin ? Style.active : ""}
        >
          Register
        </span>
      </div>
      <AuthForm isLogin={isLogin} />
    </div>
  );
};

export default Auth;
