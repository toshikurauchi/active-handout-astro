import React, { ChangeEvent, useRef, useState } from "react";
import config from "virtual:active-handout/user-config";
import { useTranslations } from "../../utils/translations";
import defaultProfileIcon from "../user-menu/default-profile-icon.svg";
import Styles from "./styles.module.scss";
import type { DecodedIdToken } from "firebase-admin/auth";

type ProfileFormProps = {
  user: DecodedIdToken;
  name: string;
  onFileChange?: (file: File) => void;
};

const t = useTranslations(config.lang);

export default function ProfilePictureButton({
  user,
  name,
  onFileChange,
}: ProfileFormProps) {
  const [file, setFile] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(URL.createObjectURL(file));
      onFileChange && onFileChange(file);
    }
  };

  return (
    <>
      <button
        className={Styles.profilePicBtn}
        type="button"
        onClick={() => {
          if (inputRef.current) inputRef.current.value = "";
        }}
      >
        <label htmlFor="change-profile-pic" className={Styles.profilePicLabel}>
          <img
            src={file || user.picture || defaultProfileIcon.src}
            alt="avatar"
            className={Styles.profilePic}
          />
          <span className={Styles.profileChangeText}>
            {user.picture || file
              ? t("profile.change-picture")
              : t("profile.add-picture")}
          </span>
        </label>
        <input
          type="file"
          ref={inputRef}
          name={name}
          id="change-profile-pic"
          className={Styles.profilePicInput}
          onChange={handleFileChange}
        />
      </button>
    </>
  );
}
