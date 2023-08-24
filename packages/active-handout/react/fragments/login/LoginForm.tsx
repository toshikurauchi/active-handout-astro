import React, { useEffect, useRef, useState } from "react";
import Styles from "./styles.module.scss";
import config from "virtual:active-handout/user-config";
import FormInput from "../../components/form-input/FormInput.tsx";
import Button from "../../components/button/Button.tsx";
import { useTranslations } from "../../../utils/translations";
import ErrorMsg from "../../components/error-msg/ErrorMsg.tsx";
import { Auth, getAuth, inMemoryPersistence } from "firebase/auth";
import { app } from "../../../firebase/client";
import {
  login,
  signinToFirebaseWithCredentials,
} from "../../../utils/client-auth.ts";
import { set } from "astro/zod";

type LoginFormProps = {
  action: string;
};

export default function LoginForm({ action }: LoginFormProps) {
  const t = useTranslations(config.lang);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [loginErrorMsg, setLoginErrorMsg] = useState("");
  const authRef = useRef<Auth | null>(null);
  if (authRef.current === null) {
    authRef.current = getAuth(app);
  }

  const auth = authRef.current;
  // This will prevent the browser from storing session data
  auth.setPersistence(inMemoryPersistence);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      setEmailErrorMsg(t("field.required"));
      return;
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setEmailErrorMsg(t("signin.invalid-email"));
      return;
    }
    if (!password) {
      setPasswordErrorMsg(t("field.required"));
      return;
    }

    try {
      const idToken = await signinToFirebaseWithCredentials(
        auth,
        email,
        password
      );

      const response = await login(idToken);
      if (response.redirected) {
        window.location.assign(response.url);
      } else {
        setLoginErrorMsg(t("signin.error"));
      }
    } catch (error: any) {
      let code = "";
      if (error.hasOwnProperty("code")) {
        code = error.code;
      }
      if (code.includes("email")) {
        setEmailErrorMsg(t("signin.invalid-email"));
        setPasswordErrorMsg("");
        setLoginErrorMsg("");
      } else if (code.includes("password")) {
        setEmailErrorMsg("");
        setPasswordErrorMsg(t("signin.invalid-password"));
        setLoginErrorMsg("");
      } else if (code.includes("too-many-requests")) {
        setEmailErrorMsg("");
        setPasswordErrorMsg("");
        setLoginErrorMsg(t("signin.too-many-requests"));
      } else {
        setEmailErrorMsg("");
        setPasswordErrorMsg("");
        setLoginErrorMsg(t("signin.error"));
      }
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setEmailErrorMsg("");
    setLoginErrorMsg("");
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setPasswordErrorMsg("");
    setLoginErrorMsg("");
  };

  return (
    <form
      action={action}
      method="post"
      className={Styles.loginForm}
      onSubmit={handleSubmit}
    >
      <FormInput
        id="email"
        labelText={t("signin.email")}
        onChange={handleEmailChange}
        errorMsg={emailErrorMsg}
      />
      <FormInput
        id="password"
        labelText={t("signin.password")}
        type="password"
        onChange={handlePasswordChange}
        errorMsg={passwordErrorMsg}
      />

      <Button type="submit" primary disabled={!email || !password}>
        {t("signin.submit")}
      </Button>
      {loginErrorMsg && <ErrorMsg>{loginErrorMsg}</ErrorMsg>}
    </form>
  );
}
