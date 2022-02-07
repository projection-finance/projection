import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import DeleteSvg from "../../assets/images/Union.svg";
import EditSvg from "../../assets/images/Subtract.svg";
import styles from "./selectedCoinsTable.module.css";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#fff",
    color: "#000",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#F8F9FA",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function StyledRow({ coin, index, deleteCoin, handleChangeTable, canEdit }) {
  const rx_live = /^\d+(?:[.,]{1}\d*)?$/;
  const [qt, setQt] = React.useState(coin.quantity);
  const [cp, setCp] = React.useState(coin.currentPrice);
  const [editAssets, setEditAssets] = React.useState([]);

  const handleChange = (event, type) => {
    let val = event.target.value;
    val = val.replace(",", ".");
    if (rx_live.test(val)) {
      if (type === "quantity") setQt(val);
      else setCp(val);

      handleChangeTable(val, index, type);
    }
  };
  const handleClickEdit = (index) => {
    editAssets[index] = !editAssets[index];
    setEditAssets([...editAssets]);
  };

  return (
    <StyledTableRow>
      <StyledTableCell component="th" scope="row">
        {coin.symbol}
      </StyledTableCell>
      <StyledTableCell component="th" scope="row">
        {canEdit != null && editAssets[index] ? (
          <Input
            sx={{ width: 50 }}
            type="text"
            value={qt}
            onChange={(e) => handleChange(e, "quantity")}
          />
        ) : (
          coin.quantity
        )}
      </StyledTableCell>
      <StyledTableCell component="th" scope="row">
        {canEdit != null && editAssets[index] ? (
          <Input
            sx={{ width: 50 }}
            type="text"
            value={cp}
            onChange={(e) => handleChange(e, "currentPrice")}
          />
        ) : (
          coin.currentPrice + " $"
        )}
      </StyledTableCell>
      {canEdit != null ? (
        <StyledTableCell
          component="th"
          scope="row"
          onClick={() => handleClickEdit(index)}
          sx={{
            cursor: "pointer",
            display: "flex",
            alignSelf: "flex-end",
            width: "62px",
            justifyContent: "space-around",
            margin: "0 auto",
            paddingLeft: 0,
            paddingEight: 0,
          }}
        >
          <img src={EditSvg} alt="delete box" />
          <p style={{ color: "#0D6EFD" }}>
            {!editAssets[index] ? "Edit" : "Save"}
          </p>
        </StyledTableCell>
      ) : (
        <td style={{display:'none'}}/>
      )}
      {canEdit != null ? (
        <StyledTableCell component="th" scope="row">
          <img
            src={DeleteSvg}
            alt="delete box"
            className={styles["deleteSvg"]}
            onClick={() => deleteCoin(index)}
          />
        </StyledTableCell>
      ) : (
        <td style={{display:'none'}}/>
      )}
    </StyledTableRow>
  );
}

export default function SelectedCoinsTable({
  coins,
  deleteCoin,
  handleChangeTable,
  canEdit,
}) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Assets</StyledTableCell>
            <StyledTableCell>Qty</StyledTableCell>
            <StyledTableCell>Current value</StyledTableCell>
            {canEdit != null ? (
              <StyledTableCell align="right">Options</StyledTableCell>
            ) : (
              <td style={{display:'none'}}/>
            )}
            {canEdit != null ? (
              <StyledTableCell align="right">Options</StyledTableCell>
            ) : (
              <td style={{display:'none'}}/>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {coins.map((coin, index) => (
            <StyledRow
              key={index}
              handleChangeTable={handleChangeTable}
              canEdit={canEdit}
              deleteCoin={deleteCoin}
              coin={coin}
              index={index}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
