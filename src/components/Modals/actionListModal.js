import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import styles from "./actionListModal.module.css";
import xSvg from "./../../assets/images/x.svg";
import Swap from "../action/swap";

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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "fit-content",
  height: "60%",
  overflowY: "scroll",
  bgcolor: "background.paper",
  p: 4,
};

function CardItemAction({ action, color }) {
  return (
    <React.Fragment>
      <CardContent sx={{ textAlign: "center", color }}>
        +
        <Typography variant="h6" component="div">
          {action}
        </Typography>
      </CardContent>
    </React.Fragment>
  );
}

export default function ActionListModal({
  open,
  handleClose,
  handleAddAction,
  projection
}) {
  const [who, setWho] = React.useState(0);
  const [selectedAction, setSelectedAction] = React.useState(0);
  const actions = [
    {
      name: "Swap token",
      component:<Swap projection={projection}  handleClose={handleClose}/>,
      condition:(projection.status[projection.status.length-1].coins.length>=2),
    },
    {
      name: "Liquidity Providing",
      condition: null,
    },
    {
      name: "Send token",
      condition: null,
    },
    {
      name: "Receive token",
      condition: null,
    },
    {
      name: "Collateral",
      condition: null,
    },
    {
      name: "Uncollateral",
      condition: null,
    },
    {
      name: "Bridge Asset(Cross-chain)",
      condition: null,
    },
    {
      name: "Mint",
      condition: null,
    },
    {
      name: "Get Rewards",
      condition: null,
    },
    {
      name: "Claim",
      condition: null,
    },
    {
      name: "Stake",
      condition: null,
    },
    {
      name: "Unstake",
      condition: null,
    },
    {
      name: "Lend",
      condition: null,
    },
    {
      name: "Repay debt",
      condition: null,
    },
    {
      name: "...",
      condition: null,
    },
  ];
  const handleClick = (action) => {
      if(action.condition){
        setSelectedAction(action);
        setWho(1);
      }else{
          window.alert("Your Profile does not fit requirement for this action!")
      }
  };
  const goActions = () => {
    setWho(0);
  };
  const active = {
    textDecoration: "none",
    color: "#6C757D ",
    cursor: "default",
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ borderRadius: 4 }}
    >
      <Box sx={style} className={styles["modal"]}>
        <img
          src={xSvg}
          onClick={handleClose}
          className={styles["xSvg"]}
          alt="x"
        />
        {who > 0 ? (
          <Stack
            direction="row"
            sx={{ width: "fit-content", margin: " 0 auto" }}
          >
            <Item sx={0 === who ? active : {}} onClick={(e) => goActions()}>
              Actions
            </Item>
            <ItemSlash>/</ItemSlash>
            <Item sx={1 === who ? active : {}}>{selectedAction.name}</Item>
          </Stack>
        ) : (
          ""
        )}
        {who === 0 ? (
          <>
            {actions
              .reduce((resultArray, item, index) => {
                const chunkIndex = Math.floor(index / 5);

                if (!resultArray[chunkIndex]) {
                  resultArray[chunkIndex] = []; // start a new chunk
                }

                resultArray[chunkIndex].push(item);

                return resultArray;
              }, [])
              .map((elem, index) => (
                <Stack
                  spacing={6}
                  direction="row"
                  key={index}
                  sx={{ margin: 5 }}
                >
                  {elem.map((action, index) => {
                    return (
                      <Card
                        key={index}
                        onClick={(e) => handleClick(action)}
                        sx={{
                          width: "100%",
                          height: 104,
                          cursor: "pointer",
                          border: "2px #ADB5BD dashed",
                          backgroundColor:
                            action.name === selectedAction.name
                              ? "#E0E0E0"
                              : "#F8F9FA",
                          flex: "1 1 0px",
                        }}
                      >
                        <CardItemAction action={action.name} />
                      </Card>
                    );
                  })}
                </Stack>
              ))}
          </>
        ) : (
            selectedAction.component !== null? selectedAction.component: <h3>Coming Soon</h3>
        )}
       
      </Box>
    </Modal>
  );
}

/*<div className={styles["modal-footer"]}>
          <Button variant="contained" onClick={handleAddAction}>
            Save Changes
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Close
          </Button>
        </div>*/