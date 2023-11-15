import React, { useMemo, useState } from "react";
import FormInput from "../../form-input/ReactFormInput";
import Styles from "./styles.module.scss";
import config from "virtual:active-handout/user-config";
import { useTranslations } from "../../../utils/translations";
import { renderMarkdown } from "./markdown";

type MarkdownInputProps = {
  disabled: boolean;
} & Pick<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">;

export default function MarkdownInput({
  onChange,
  value,
  disabled,
}: MarkdownInputProps) {
  const t = useTranslations(config.lang);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [markdownHasErrors, setMarkdownHasErrors] = useState(false);

  const handleToggleMarkdown = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowMarkdownPreview(event.target.checked);
  };

  const renderedContent = useMemo(() => {
    const markdown = (value || "") as string;
    try {
      return renderMarkdown(markdown);
    } catch (e) {
      console.error(e);
      setMarkdownHasErrors(true);
      return markdown;
    }
  }, [value]);

  const showPreview = (disabled || showMarkdownPreview) && !markdownHasErrors;
  return (
    <>
      {showPreview && (
        <div
          className={Styles.previewContainer}
          dangerouslySetInnerHTML={{
            __html: renderedContent,
          }}
        ></div>
      )}
      {!showPreview && (
        <FormInput
          type="text"
          minLines={3}
          onChange={onChange}
          value={value}
          multiline
        ></FormInput>
      )}
      {!disabled && (
        <div className={Styles.markdownCheckboxContainer}>
          <label>
            <input
              type="checkbox"
              onChange={handleToggleMarkdown}
              checked={showMarkdownPreview}
            ></input>
            {t("markdown-input.toggle-preview")}
          </label>
        </div>
      )}
      {markdownHasErrors && (
        <p className={Styles.hasErrors}>{t("markdown-input.has-errors")}</p>
      )}
    </>
  );
}
