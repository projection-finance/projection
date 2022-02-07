import React from "react";
import { useSelector } from "react-redux";
import ProjctionTable from "../projection/projectionTable";
import ListActions from "../projection/listActions";
import styles from "./myProjections.module.css";

export default function MyProjections(){

    const { projections } = useSelector((state) => state.projection);

    return(
        <div className={styles["container"]}>
            <ProjctionTable projections={projections} />
            <ListActions projections={projections} />
        </div>
    );
}