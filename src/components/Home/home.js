import React from "react";
import styles from "./home.module.css";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <div className={styles["container"]}>
      <Link
        to="/projection"
        style={{
          textDecoration: "none",
        }}
      >
        <Button
          variant="contained"
          className={styles["btnCenter"]}
        >
          New projection
        </Button>
      </Link>
    </div>
  );
}
