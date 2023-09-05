import React, { HTMLAttributes } from "react";
import Styles from "./styles.module.scss";

export default function Card(props: HTMLAttributes<HTMLDivElement>) {
  return <div className={Styles.card} {...props} />;
}
