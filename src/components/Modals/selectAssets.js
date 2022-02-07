import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import { getCoins } from "../../adapters/apis";
import TextField from "@mui/material/TextField";
import styles from "./selectAssets.module.css";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteSvg from "../../assets/images/Union.svg";
import EditSvg from "../../assets/images/Subtract.svg";

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
}));

function AssetsTable({ coins }) {
  return (
    <TableContainer
      sx={{ borderRadius: 0, boxShadow: "none" }}
      component={Paper}
    >
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell
              sx={{ border: 0, fontWeight: 700, fontSize: "16px" }}
            >
              Assets
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coins.map((coin, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell sx={{ border: 0 }} component="th" scope="row">
                + {coin.symbol}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function SelectAssets({
  setSelectedCoins,
  value,
  selectedCoins,
  setValue,
  setErreur,
  setShowErr,
}) {
  const rx_live = /^\d+(?:[.,]{1}\d*)?$/;
  const [showQt, setShowQt] = React.useState(false);
  const [coins, setCoins] = React.useState([]);
  const [currentCoin, setCurrentCoin] = React.useState(null);
  const [currentPrice, setCurrentPrice] = React.useState(0);
  const [qt, setQt] = React.useState(0);

  React.useEffect(() => {
    const localCoins = localStorage.getItem("coins");

    if (!localCoins || JSON.parse(localCoins).length === 0)
      getCoins().then((res) => {
        setCoins(res.data);
        localStorage.setItem("coins", JSON.stringify(res.data));
      });
    else setCoins(JSON.parse(localCoins));
  }, []);

  const addQuantity = (value) => {
    const exist = selectedCoins.some((elem) => elem.name === value.name);
    if (exist) {
      setErreur("Coin already added!");
      setShowErr(true);
      return;
    }

    setShowErr(false);
    setErreur("");
    setCurrentCoin(value);
    setShowQt(true);
    setQt(0);
    setCurrentPrice(0);
  };

  const handleQtChange = (event) => {
    let val = event.target.value;
    val = val.replace(",", ".");
    if (rx_live.test(val)) setQt(val);
  };
  const handleCpChange = (event) => {
    let val = event.target.value;
    val = val.replace(",", ".");
    if (rx_live.test(val)) setCurrentPrice(val);
  };

  const addCoins = () => {
    selectedCoins.push({
      ...currentCoin,
      quantity: parseFloat(qt),
      currentPrice: parseFloat(currentPrice),
    });
    setSelectedCoins(selectedCoins);
    setCurrentCoin(null);
    setValue(null);
  };
  const handelAfterAddQ = () => {
    if (qt <= 0 || isNaN(qt)) {
      setErreur("Amount must be greater than 0 !");
      setShowErr(true);
      return;
    }
    if (currentPrice <= 0 || isNaN(currentPrice)) {
      setErreur("Current Price must be greater than 0 !");
      setShowErr(true);
      return;
    }
    addCoins(qt);
    setQt(0);
    setCurrentPrice(0);
    setShowQt(false);
    setShowErr(false);
  };
  return (
    <>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            setValue({
              name: newValue,
            });
            addQuantity(newValue);
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            setValue({
              name: newValue.inputValue,
            });
            addQuantity({ name: newValue.inputValue, symbol: "" });
          } else {
            setValue(newValue);
            if (newValue) addQuantity(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const { inputValue } = params;
          if (inputValue.length === 0) return [];
          const filtered = options.filter(
            (item) =>
              item.name.toLowerCase().startsWith(inputValue) ||
              item.symbol.toLowerCase().startsWith(inputValue)
          );

          // Suggest the creation of a new value
          const isExisting = options.some(
            (option) => inputValue === option.name
          );
          if (inputValue !== "" && !isExisting) {
            filtered.push({
              inputValue,
              name: `Add "${inputValue}"`,
            });
          }

          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        id="free-solo-with-text-demo"
        options={coins}
        getOptionLabel={(option) => {
          if (typeof option === "string") {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.name;
        }}
        renderOption={(props, option) => <li {...props}>{option.name}</li>}
        sx={{ width: "100%" }}
        freeSolo
        renderInput={(params) => <TextField {...params} label="Assets" />}
      />
      {showQt ? (
        <div className={styles["div-flex"]}>
          <InputLabel htmlFor="component-helper">Amount</InputLabel>

          <Input
            type="text"
            value={qt}
            placeholder="Amount"
            onChange={handleQtChange}
          />
          <InputLabel htmlFor="component-helper">Current price</InputLabel>

          <Input
            type="text"
            placeholder="Current price"
            value={currentPrice}
            onChange={handleCpChange}
          />

          <Button variant="contained" onClick={handelAfterAddQ}>
            add coin
          </Button>
        </div>
      ) : (
        ""
      )}
      
      {selectedCoins.length  ? <AssetsTable coins={selectedCoins} /> : ""}
    </>
  );
}
