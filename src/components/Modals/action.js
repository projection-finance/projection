import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import styles from "./addProject.module.css";
import TextField from "@mui/material/TextField";
import { useDispatch } from "react-redux";
import InputLabel from "@material-ui/core/InputLabel";
import Stack from "@mui/material/Stack";
import DateAdapter from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import moment from "moment";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { ADD_ACTION_TO_Projection } from "../../redux/projections/projection.types";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80%",
  overflowY: "scroll",
  bgcolor: "background.paper",
  p: 4,
};

export default function Action1({ open, handleClose, projection, action }) {
  const rx_live = /^\d+(?:[.,]{1}\d*)?$/;
  const dispatch = useDispatch();
  const [date, setDate] = React.useState(moment(projection.startDate));
  const [minDate, setMinDate] = React.useState(moment(projection.startDate));
  const [assetIndex, setAssetIndex] = React.useState(-1);
  const [selectedAsset, setSelectedAsset] = React.useState(null);
  const [newPrice, setNewPrice] = React.useState(null);
  const [erreur, setErreur] = React.useState("");
  const [showErr, setShowErr] = React.useState(false);

  const isDateValid = (d = null) => {
    d = d ? d.toDate().getTime() : date.toDate().getTime();
    return (
      d >= minDate.toDate().getTime() &&
      d <= moment(projection.endDate).toDate().getTime()
    );
  };

  const handleDateChange = (newValue) => {
    if (isDateValid(newValue)) {
      setDate(newValue);
      setShowErr(false);
    } else {
      setErreur(
        `Date must be in ${minDate.format("DD-MM-YYYY")} & ${moment(
          projection.endDate
        ).format("DD-MM-YYYY")}`
      );
      setShowErr(true);
    }
  };

  const findLastActionByCoin = (coin) => {
    console.log(projection);
    const arr = projection.actions.filter((act) => {
      return act.coin.name === coin.name;
    });
    console.log(arr);
    return arr.length > 0
      ? moment(arr[arr.length - 1].date).add(1, "days")
      : moment(projection.startDate).subtract(1, "days");
  };
  const handleChange = (event) => {
    const index = event.target.value;
    setAssetIndex(index);
    setSelectedAsset(projection.coins[index]);
    setNewPrice(projection.coins[index].currentPrice);
    setMinDate(findLastActionByCoin(projection.coins[index]));
    setDate(findLastActionByCoin(projection.coins[index]));
  };
  const handleNepChange = (event) => {
    let val = event.target.value;
    val = val.replace(",", ".");
    if (rx_live.test(val)) setNewPrice(val);
  };

  const handleAddAction = () => {
    if (rx_live.test(newPrice) && isDateValid()) {
      const newaction = {
        id: (Math.random() + 1).toString(36).substring(7),
        coin: selectedAsset,
        date,
        type: action.name,
        price: newPrice,
      };
      dispatch({
        type: ADD_ACTION_TO_Projection,
        payload: { projection, action: newaction },
      });
      handleClose();
      setShowErr(false);
    } else {
      setErreur(`Please check your information :
        -Date must be in ${minDate.format("DD-MM-YYYY")} & ${moment(
        projection.endDate
      ).format("DD-MM-YYYY")}!
        -Price must be a number!
      `);
      setShowErr(true);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{borderRadius:4}}
      >
        <Box sx={style} className={styles["modal"]}>
          {showErr ? <p className={styles["error"]}>{erreur}</p> : ""}
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Configure your Action:{action.name}
          </Typography>

          <LocalizationProvider dateAdapter={DateAdapter}>
            <Stack spacing={3}>
              {" "}
              <DesktopDatePicker
                label="Start Date"
                inputFormat="DD-MM-YYYY"
                value={date}
                disabled={selectedAsset === null}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
          </LocalizationProvider>
          <Stack>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Assets</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Assets"
                value={assetIndex}
                onChange={handleChange}
              >
                {projection.coins.map((coin, index) => {
                  return (
                    <MenuItem key={index} value={index}>
                      {coin.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {selectedAsset ? (
              <FormControl fullWidth>
                <InputLabel htmlFor="component-helper">
                  Current price {selectedAsset.currentPrice}${" "}
                </InputLabel>

                <Input
                  type="text"
                  placeholder="Current price"
                  value={newPrice}
                  onChange={handleNepChange}
                />
              </FormControl>
            ) : (
              ""
            )}
          </Stack>

          <div className={styles["modal-footer"]}>
            <Button variant="contained" onClick={handleAddAction}>
              Save Changes
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
