import React from "react";
import styles from "./action.module.css";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import moment from "moment";
import SelectedCoinsTable from "../Modals/selectedCoinsTable";
import Arrow from "../../assets/images/arrow.svg";
import { Button } from "@mui/material";
import ActionListModal from "../Modals/actionListModal";

function CardItem({ statu, text }) {
  const sum = statu.coins.reduce((tot, elem) => {
    return tot + elem.currentPrice * elem.quantity;
  }, 0);
  return (
    <React.Fragment>
      <CardContent>
        <Typography variant="h5" component="div">
          Portfolio -{moment(statu.date).format("DD/MM/YYYY")} {text}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {sum.toFixed(2)} $
        </Typography>
        <SelectedCoinsTable coins={statu.coins} />
      </CardContent>
    </React.Fragment>
  );
}

function CardItemAction({ handleActionListOpen }) {
  return (
    <React.Fragment>
      <CardContent>
        <Typography variant="p" component="div">
          Add your first action
        </Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#0D6EFD", color: "#212529" ,marginTop:3}}
          onClick={handleActionListOpen}
        >
          Select an action
        </Button>
      </CardContent>
    </React.Fragment>
  );
}

function CardItemIcon() {
  return (
    <React.Fragment>
      <CardContent
        sx={{
          width: "fit-content",
          paddingBottom: "0px !important",
          padding: "5px !important",
          margin: "0 auto",
        }}
      >
        <img src={Arrow} alt="Arrow Down" />
      </CardContent>
    </React.Fragment>
  );
}

export default function Action({ projection }) {
    const [open,setOpen] = React.useState(false)
    const handleActionListOpen = () => {setOpen(true)};
    const handleAddAction = () => {};
    const handleClose = () => {setOpen(false)};

  return (
    <div className={styles["container"]}>
        {
            open ? <ActionListModal projection={projection} open={open} handleClose={handleClose} handleAddAction={handleAddAction} /> :''
        }
      <p>Now you can simulate actions on your virtual portfolio, let's go !</p>
      <Stack direction="row" spacing={6}>
        <Stack
          sx={{
            width: "fit-content",
            margin: 0,
          }}
          spacing={3}
        >
          {projection.status.map((statu, index) => {
            return (
              <React.Fragment key={index}>
                <Card sx={{ width: "fit-content" }} variant="outlined">
                  <CardItem
                    statu={statu}
                    text={
                      index === 0
                        ? " (start)"
                        : projection.status.length - 1 === index
                        ? " (end) "
                        : ""
                    }
                  />
                </Card>
                {index < projection.status.length - 1 ? (
                  <Card
                    sx={{
                      width: "fit-content",
                      margin: "20px auto !important",
                    }}
                  >
                    <CardItemIcon />
                  </Card>
                ) : (
                  ""
                )}
              </React.Fragment>
            );
          })}
        </Stack>
        <Stack
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "fit-content",
            margin: 0,
          }}
          spacing={3}
        >
          <Card sx={{border: "2px #7B61FF dashed"}}>
            <CardItemAction handleActionListOpen={handleActionListOpen} />
          </Card>
        </Stack>
      </Stack>
    </div>
  );
}
