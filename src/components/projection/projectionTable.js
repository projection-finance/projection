import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Button from "@mui/material/Button";
import SelectedCoinsTable from "../Modals/selectedCoinsTable";
import moment from "moment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Action1 from "../Modals/action";
import Add_Edit_PorjectModal from "../Modals/add_Edit_Project";
import { useDispatch } from "react-redux";
import { DELETE_Projection } from "../../redux/projections/projection.types";
import { useNavigate  } from "react-router-dom";

function Row(props) {
  const { projection, actionsProj } =
    props;
  const [open, setOpen] = React.useState(false);
  const [actionValue, setActionValue] = React.useState(0);
  const handleChange = (event) => {
    const item = event.target.value;
    setActionValue(item);
    actionsProj[item].action(projection);
    setActionValue(-1);
  };
  
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {projection.name}
        </TableCell>
        <TableCell component="th" scope="row">
          {moment(projection.startDate).format("DD-MM-YYYY")}
        </TableCell>
        <TableCell component="th" scope="row">
          {moment(projection.endDate).format("DD-MM-YYYY")}
        </TableCell>
        <TableCell component="th" scope="row">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Actions</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Make Action"
              onChange={handleChange}
              value={actionValue}
            >
              {actionsProj.map((action, index) => {
                return (
                  <MenuItem key={index} value={index}>
                    {action.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Coins
              </Typography>
              <SelectedCoinsTable coins={projection.coins} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function ProjctionTable({ projections }) {
  const dispatch = useDispatch();
  const history = useNavigate ();
  const handleEditProjection = (selectedProjection) => {
    history(`/projection/${selectedProjection.id}`);

  };
  const handleDeleteProjection = (selectedProjection) => {
    dispatch({ type: DELETE_Projection, payload: selectedProjection });
  };
  const actionsProj = [
    {
      name: "Select Action",
      action: ()=>"",
    },
    {
      name: "View",
      action: handleEditProjection,
    },
    {
      name: "Delete",
      action: handleDeleteProjection,
    },
  ];
 /*OLD action TODO remove
 {openAction1 ? (
    <Action1
      action={selectedAction}
      open={openAction1}
      projection={selectedProjection}
      handleClose={handleCloseAction1}
    />
  ) : (
    ""
  )}*/
  return (
    <>
      {" "}
     
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projections.map((prj, index) => (
              <Row
                key={index}
                projection={prj}
                actionsProj={actionsProj}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
