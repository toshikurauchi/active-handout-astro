import React, { useState } from "react";
import Styles from "./styles.module.scss";
import config from "virtual:active-handout/user-config";
import FormInput from "../../components/form-input/ReactFormInput.tsx";
import Button from "../../components/button/ReactButton.tsx";
import { useTranslations } from "../../utils/translations.ts";
import ErrorMsg from "../../components/error-msg/ReactErrorMsg.tsx";
import {
  login,
  signinToFirebaseWithCredentials,
} from "../../utils/client-auth.ts";

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      setEmailErrorMsg(t("field.required"));
      return;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setEmailErrorMsg(t("auth.invalid-email"));
      return;
    }
    if (!password) {
      setPasswordErrorMsg(t("field.required"));
      return;
    }

    try {
      const idToken = await signinToFirebaseWithCredentials(email, password);

      const response = await login(idToken);
      if (response.redirected) {
        window.location.assign(response.url);
      } else {
        setLoginErrorMsg(t("auth.signin-error"));
      }
    } catch (error: any) {
      let code = "";
      if (error.hasOwnProperty("code")) {
        code = error.code;
      }
      // More error codes here: https://firebase.google.com/docs/auth/admin/errors
      if (code.includes("email")) {
        setEmailErrorMsg(t("auth.invalid-email"));
        setPasswordErrorMsg("");
        setLoginErrorMsg("");
      } else if (code.includes("password")) {
        setEmailErrorMsg("");
        setPasswordErrorMsg(t("auth.invalid-password"));
        setLoginErrorMsg("");
      } else if (code.includes("too-many-requests")) {
        setEmailErrorMsg("");
        setPasswordErrorMsg("");
        setLoginErrorMsg(t("auth.too-many-requests"));
      } else {
        setEmailErrorMsg("");
        setPasswordErrorMsg("");
        setLoginErrorMsg(t("auth.signin-error"));
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
        labelText={t("auth.email-label")}
        onChange={handleEmailChange}
        errorMsg={emailErrorMsg}
      />
      <FormInput
        id="password"
        labelText={t("auth.password-label")}
        type="password"
        onChange={handlePasswordChange}
        errorMsg={passwordErrorMsg}
      />

      <Button type="submit" primary disabled={!email || !password}>
        {t("auth.signin-submit")}
      </Button>
      {loginErrorMsg && <ErrorMsg>{loginErrorMsg}</ErrorMsg>}
    </form>
  );
}
