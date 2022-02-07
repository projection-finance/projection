import React from "react";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Add_Edit_PorjectModal from "../Modals/add_Edit_Project";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import MyChart from "../Chart/myChart";
import styles from "./projection.module.css";
import Action from "../action/action";

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "center",
  backgroundColor: "initial",
  border: 0,
  boxShadow: "none",
  textDecoration: "underline",
  color: "#0D6EFD",
  cursor: "pointer",
}));

const ItemSlash = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "center",
  backgroundColor: "initial",
  border: 0,
  boxShadow: "none",
  textDecoration: "none",
  color: "#6C757D",
}));

export default function Projection() {
  const [open, setOpen] = React.useState(false);
  const [who, setWho] = React.useState(0);
  const { projections } = useSelector((state) => state.projection);
  const [projectionName, setProjctionName] = React.useState("");
  const [projectEdit, setProjctionEdit] = React.useState(null);
  const [projection, setProjction] = React.useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  let { projectionId } = useParams();
  React.useEffect(() => {
    if (projectionId) {
      const [firstItem] = projections.filter((prj) => prj.id == projectionId);
      if (firstItem) {
        setProjctionEdit(firstItem);
        setProjction(firstItem);
        setWho(2)
      }
      else setWho(0)
    }
    if (!projectEdit) {
      const date = new Date();
      setProjctionName(
        `projection_${date.getDate()}/${date.getMonth()}/${date.getFullYear()}_${date.getHours()}:${date.getMinutes()}`
      );
    }
    if (who === 0) handleOpen();
  }, []);

  const afterSave = (projectionAdded) => {
    setProjction(projectionAdded);
    setProjctionEdit(projectionAdded);
    setWho(who + 1);
  };

  const elements = [
    <Add_Edit_PorjectModal
      afterSave={afterSave}
      projectionName={projectionName}
      projectEdit={projectEdit}
      open={open}
      handleClose={handleClose}
    />,

    <MyChart projection={projection} />,
    <Action projection={projection} />
  ];

  const paths = ["Projection", "Portfolio", "Actions"];
  const active = {
    textDecoration: "none",
    color: "#6C757D ",
    cursor: "default",
  };

  const goNext = (index) => {
    //TODO validate if current is valide
    if (index != 0 && !projection) handleOpen();
    else setWho(index);
    if(who===0)
      handleOpen()
  };
  return (
    <div className={styles["container"]}>
      <Stack direction="row">
        {paths.map((elem, index) => {
          return (
            <React.Fragment key={index}>
              <Item
                sx={index === who ? active : {}}
                onClick={(e) => goNext(index)}
              >
                {elem}
              </Item>
              {index != paths.length - 1 ? <ItemSlash>/</ItemSlash> : ""}
            </React.Fragment>
          );
        })}
      </Stack>
      {elements.map((elem, index) => {
        return <React.Fragment key={index}>{who === index ? elem : ""}</React.Fragment>;
      })}
    </div>
  );
}
