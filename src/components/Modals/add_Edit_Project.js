import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import styles from "./addProject.module.css";
import TextField from "@mui/material/TextField";
import SelectedCoinsTable from "./selectedCoinsTable";
import { useDispatch } from "react-redux";
import DateAdapter from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import moment from "moment";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import xSvg from "./../../assets/images/x.svg";
import {
  ADD_Projection,
  EDIT_Projection,
} from "../../redux/projections/projection.types";
import SelectAssets from "./selectAssets";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  height: "60%",
  overflowY: "scroll",
  bgcolor: "background.paper",
  p: 4,
  margin: "0 20px",
};

export default function Add_Edit_ProjectModal({
  afterSave,
  open,
  handleClose,
  projectEdit,
  projectionName
}) {
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(null);
  const [projection, setProjction] = React.useState("");
  const [showErr, setShowErr] = React.useState(false);
  const [erreur, setErreur] = React.useState("");
  const [startDate, setStartDate] = React.useState(moment(new Date()));
  const [endDate, setEndDate] = React.useState(moment(new Date()).add(1, "Y"));
  const [selectedCoins, setSelectedCoins] = React.useState([]);
  React.useEffect(() => {
    setProjction(
      projectEdit ? projectEdit.name : projectionName
    );
    setSelectedCoins(projectEdit ? projectEdit.coins : []);
  }, [projectionName, projectEdit]);

  const deleteCoin = (index) => {
    if (window.confirm("Are you sure!")) {
      selectedCoins.splice(index, 1);
      setSelectedCoins([...selectedCoins]);
    }
  };
  const handleChangeTable = (val, index, who) => {
    if (who === "quantity") selectedCoins[index].quantity = parseFloat(val);
    else selectedCoins[index].currentPrice = parseFloat(val);
    setSelectedCoins(selectedCoins);
  };
  const handlePrjChange = (event) => {
    setProjction(event.target.value);
  };
  const clearForm = () => {
    setProjction("");
    setSelectedCoins([]);
    setValue("");
  };
  const handleCloseModal = () => {
    if (projectEdit ) clearForm();
    handleClose();
  };
  const handleAddPrjoect = () => {
    if (selectedCoins.length === 0) {
      setErreur("You need to add coins!");
      setShowErr(true);
      return;
    }
    setShowErr(false);
    setErreur("");
    const project = {...projectEdit,...{
      id: projectEdit ?projectEdit.id : Math.random(),
      name: projection,
      coins: selectedCoins,
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
    }};
    if (projectEdit) {
      projectEdit = { ...projectEdit, ...project };
      dispatch({ type: EDIT_Projection, payload: projectEdit });
    } else dispatch({ type: ADD_Projection, payload: project });
    afterSave(project)
    handleCloseModal();
  };

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
  };
  const handleEndDateChange = (newValue) => {
    if (newValue.toDate().getTime() < startDate.toDate().getTime()) {
      setEndDate(endDate);
      setErreur("The end date must be greater than the start date!");
      setShowErr(true);
    } else {
      setShowErr(false);
      setErreur("");
      setEndDate(newValue);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className={styles["modal"]}>
          <img
            src={xSvg}
            onClick={handleClose}
            className={styles["xSvg"]}
            alt="x"
          />
          {showErr ? <p className={styles["error"]}>{erreur}</p> : ""}

          <LocalizationProvider dateAdapter={DateAdapter}>
            <div className={styles["flex-row"]}>
              <TextField
                className={styles["flex-row-textfield"]}
                label="Projection"
                value={projection}
                onChange={handlePrjChange}
              />
              <DesktopDatePicker
                label="Start Date"
                inputFormat="DD-MM-YYYY"
                value={startDate}
                onChange={handleStartDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
              <DesktopDatePicker
                label="End Date"
                inputFormat="DD-MM-YYYY"
                value={endDate}
                onChange={handleEndDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
          </LocalizationProvider>
          <Typography
            id="modal-modal-description"
            className={styles["modal-modal-description"]}
          >
            Configure your projection, by adding assets to your portfolio:
          </Typography>
          <SelectAssets
            setSelectedCoins={setSelectedCoins}
            value={value}
            selectedCoins={selectedCoins}
            setErreur={setErreur}
            setValue={setValue}
            setShowErr={setShowErr}
          />

          {selectedCoins.length ? (
            <>
              <p>Your portfolio </p>
              <SelectedCoinsTable
                coins={[...selectedCoins]}
                handleChangeTable={handleChangeTable}
                deleteCoin={deleteCoin}
                canEdit={true}
              />
            </>
          ) : (
            ""
          )}

          <div className={styles["modal-footer"]} >
            <Button variant="contained" onClick={handleAddPrjoect}>
              Save Changes
            </Button>
            <Button variant="outlined" onClick={handleCloseModal}>
              Close
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
