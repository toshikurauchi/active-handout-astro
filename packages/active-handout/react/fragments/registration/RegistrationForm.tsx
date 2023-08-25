import React, { useState } from "react";
import Styles from "./styles.module.scss";
import config from "virtual:active-handout/user-config";
import FormInput from "../../components/form-input/FormInput.tsx";
import Button from "../../components/button/Button.tsx";
import { useTranslations } from "../../../utils/translations.ts";

type LoginFormProps = {
  action: string;
};

export default function LoginForm({ action }: LoginFormProps) {
  const t = useTranslations(config.lang);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameErrorMsg, setNameErrorMsg] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    let foundErrors = false;
    if (!name) {
      setNameErrorMsg(t("field.required"));
      foundErrors = true;
    } else if (name.split(" ").length < 2) {
      setNameErrorMsg(t("auth.invalid-name"));
      foundErrors = true;
    } else if (!email) {
      setEmailErrorMsg(t("field.required"));
      foundErrors = true;
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setEmailErrorMsg(t("auth.invalid-email"));
      foundErrors = true;
    } else if (!password) {
      setPasswordErrorMsg(t("field.required"));
      foundErrors = true;
    }

    if (foundErrors) {
      event.preventDefault();
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setNameErrorMsg("");
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setEmailErrorMsg("");
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setPasswordErrorMsg("");
  };

  return (
    <form
      action={action}
      method="post"
      className={Styles.loginForm}
      onSubmit={handleSubmit}
    >
      <FormInput
        id="name"
        name="name"
        labelText={t("auth.name-label")}
        onChange={handleNameChange}
        errorMsg={nameErrorMsg}
      />
      <FormInput
        id="email"
        name="email"
        labelText={t("auth.email-label")}
        onChange={handleEmailChange}
        errorMsg={emailErrorMsg}
      />
      <FormInput
        id="password"
        name="password"
        labelText={t("auth.password-label")}
        type="password"
        onChange={handlePasswordChange}
        errorMsg={passwordErrorMsg}
      />

      <Button type="submit" primary disabled={!name || !email || !password}>
        {t("auth.register-submit")}
      </Button>
    </form>
  );
}
