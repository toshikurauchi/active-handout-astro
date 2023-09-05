import React, { ChangeEvent, useEffect, useState } from "react";
import config from "virtual:active-handout/user-config";
import { useTranslations } from "../../utils/translations";
import type { DecodedIdToken } from "firebase-admin/auth";
import Styles from "./styles.module.scss";
import ProfilePictureButton from "../../components/profile-picture-input/ProfilePictureButton";
import Card from "../../components/card/Card";
import FormInput from "../../components/form-input/ReactFormInput";
import Button from "../../components/button/ReactButton";

const t = useTranslations(config.lang);

type ProfileFormProps = {
  user: DecodedIdToken;
};

function handlePageUnload(event: BeforeUnloadEvent) {
  console.log("Page unload", document.activeElement);
  event.preventDefault();
  return (event.returnValue = "");
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [hasChanges, setHasChanges] = useState(false);
  const [name, setName] = useState(user.name);

  useEffect(() => {
    if (hasChanges) {
      window.addEventListener("beforeunload", handlePageUnload, {
        capture: true,
      });
    } else {
      window.removeEventListener("beforeunload", handlePageUnload, {
        capture: true,
      });
    }
  }, [hasChanges]);

  const handleProfilePicChange = () => {
    setHasChanges(true);
  };

  const handleDisplayNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHasChanges(true);
    setName(event.target.value);
  };

  const handleSubmit = () => {
    setHasChanges(false);
    window.removeEventListener("beforeunload", handlePageUnload, {
      capture: true,
    });
  };

  return (
    <Card>
      <form
        className={Styles.formContainer}
        encType="multipart/form-data"
        action="/api/auth/profile"
        method="POST"
        onSubmit={handleSubmit}
      >
        <ProfilePictureButton
          user={user}
          name="profile-pic"
          onFileChange={handleProfilePicChange}
        />
        <FormInput
          name="display-name"
          id="display-name"
          labelText={t("profile.displayName")}
          value={name}
          onChange={handleDisplayNameChange}
        />
        <Button type="submit" disabled={!hasChanges}>
          SAVE
        </Button>
      </form>
    </Card>
  );
}
