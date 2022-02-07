import React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import DateAdapter from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import moment from "moment";
import { Button } from "@mui/material";
import styles from "./swap.module.css";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function Swap({ projection, handleClose }) {
  const [date, setDate] = React.useState(moment());
  const coins = projection.status[projection.status.length - 1].coins;
  const [tokenA, setTokenA] = React.useState(coins[0]);
  const [tokenB, setTokenB] = React.useState(coins[1]);
  const [tokenPriceA, setTokenPriceA] = React.useState(tokenA.currentPrice);
  const [tokenPriceB, setTokenPriceB] = React.useState(tokenB.currentPrice);
  const [amountA, setAmountA] = React.useState(0);
  const [amountB, setAmountB] = React.useState(0);
  const [totaleValueA, setTotaleValueA] = React.useState(0);
  const [totaleValueB, setTotaleValueB] = React.useState(0);
  const [feesEnabled, setFeesEnabled] = React.useState(false);
  const [feesCoin, setFeesCoin] = React.useState(tokenA);
  const [feesAmount, setFeesAmount] = React.useState(0);
  const [feesValue, setFeesValue] = React.useState(0);
  const [showErr, setShowErr] = React.useState(false);
  const [erreur, setErreur] = React.useState("");

  const getPriceInDate = (token,dateValue=date) => {
    const [chartToken] = projection.chart.filter(
        (c) => c.label === token.symbol
      ),
      data = chartToken.mainData;
    let a, b;
    data.sort((a, b) => a.x - b.x);
    for (let i = 0; i < data.length - 1; i++) {
    if (
        moment(new Date(data[i].x*60)).format("DD-MM-YYYY") ===
        dateValue.format("DD-MM-YYYY")
      ){
        return data[i].y;
    }
      else if (
        dateValue.isBetween(
          new Date(data[i].x * 60),
          new Date(data[i + 1].x * 60)
        )
      ) {
        a = data[i];
        b = data[i + 1];
        break;
      }
    }
    if(!a || !b){
        return token.currentPrice
    }

    const lerp = (x, y, a) => x*(1 - a) + y * a;
    const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
    const invlerp = (x, y, a) => clamp((a - x) / (y - x));
    const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));
    const val_jour_a = a.y;
    const val_jour_b = b.y;
    const total_distance_ab = moment(new Date(a.x * 60)).diff(
      moment(new Date(b.x * 60)),
      "days"
    );
    const jour_x = moment(new Date(a.x * 60)).diff(date, "days");
    const percent = 100 / (total_distance_ab / jour_x) / 100;
    return lerp(val_jour_a, val_jour_b, percent);
  };

  const handleTokenAChange = (e) => {
    const coin = e.target.value;
    setTokenA(coin);
    setTokenPriceA(getPriceInDate(coin).toFixed(2));
  };
  const handleTokenBChange = (e) => {
    const coin = e.target.value;
    setTokenB(coin);
    setTokenPriceB(getPriceInDate(coin).toFixed(2));
  };
  const handleAddAction = () => {};
  const handleAmountAChange = (e) => {
    let amountA = e.target.value.replace(tokenA.symbol, "");
    setAmountA(amountA);
    const amountB = (tokenPriceA / tokenPriceB) * amountA;
    setAmountB(amountB + " " + tokenB.symbol.toUpperCase());

    setTotaleValueA(amountA * tokenPriceA + "$");
    setTotaleValueB(amountB * tokenPriceB + "$");
  };

  const isDateValid = (d = null) => {
    d = d ? d.toDate().getTime() : date.toDate().getTime();
    return (
      d >= moment(projection.startDate).toDate().getTime() &&
      d <= moment(projection.endDate).toDate().getTime()
    );
  };

  const handleDateChange = (newValue) => {
    if (isDateValid(moment(newValue))) {
      setDate(newValue);

      setTokenPriceA(getPriceInDate(tokenA,newValue).toFixed(2));
      if (tokenB) setTokenPriceB(getPriceInDate(tokenB,newValue).toFixed(2));
      setShowErr(false);
    } else {
      setErreur(
        `Date must be in ${moment(projection.startDate).format(
          "DD-MM-YYYY"
        )} & ${moment(projection.endDate).format("DD-MM-YYYY")}`
      );
      setShowErr(true);
    }
  };
  return (
    <>
      {showErr ? <p className={styles["error"]}>{erreur}</p> : ""}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, boxShadow: 0 }}>
          <TableBody>
            <TableRow>
              <TableCell sx={{ borderBottom: "none" }}>
                <LocalizationProvider dateAdapter={DateAdapter}>
                  <DatePicker
                    value={date}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </TableCell>
              <TableCell sx={{ borderBottom: "none" }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ color: "#219C97" }}
                >
                  {tokenA
                    ? `1 ${tokenA.symbol.toUpperCase()} = ${
                        (tokenPriceA / tokenPriceB).toFixed(2)
                      } ${tokenB.symbol.toUpperCase()}`
                    : ""}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ borderBottom: "none" }}>
                <p>Swap token A</p>
                <FormControl fullWidth>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={tokenA}
                    onChange={handleTokenAChange}
                  >
                    {coins.map((c, index) => (
                      <MenuItem key={index} value={c}>
                        {c.symbol}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell sx={{ borderBottom: "none" }}>
                <p>Swap token B</p>
                <FormControl fullWidth>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={tokenB}
                    onChange={handleTokenBChange}
                  >
                    {coins
                      .filter((c) => c.symbol !== tokenA.symbol)
                      .map((c, index) => (
                        <MenuItem key={index} value={c}>
                          {c.symbol}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ borderBottom: "none" }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ color: "#219C97" }}
                >
                  {tokenA
                    ? `1 ${tokenA.symbol.toUpperCase()} = ${tokenPriceA} $`
                    : ""}
                </Typography>
              </TableCell>
              <TableCell sx={{ borderBottom: "none" }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ color: "#219C97" }}
                >
                  {tokenA
                    ? `1  ${tokenB.symbol.toUpperCase()} = ${tokenPriceB} $`
                    : ""}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ borderBottom: "none" }}>
                <TextField
                  id="outlined-start-adornment"
                  sx={{ m: 1, width: "25ch" }}
                  value={amountA}
                  onChange={handleAmountAChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ bgcolor: "#E9ECEF", color: "#212529" }}
                      >
                        Amount
                      </InputAdornment>
                    ),
                  }}
                />
              </TableCell>
              <TableCell sx={{ borderBottom: "none" }}>
                <TextField
                  disabled
                  id="outlined-start-adornment"
                  sx={{
                    m: 1,
                    width: "25ch",
                    bgcolor: "#E9ECEF",
                    color: "#212529",
                  }}
                  value={amountB}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ bgcolor: "#E9ECEF", color: "#212529" }}
                      >
                        Amount
                      </InputAdornment>
                    ),
                  }}
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ borderBottom: "none" }}>
                <TextField
                  disabled
                  id="outlined-start-adornment"
                  sx={{
                    m: 1,
                    width: "25ch",
                    bgcolor: "#E9ECEF",
                    color: "#212529",
                  }}
                  value={totaleValueA}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ bgcolor: "#E9ECEF", color: "#212529" }}
                      >
                        Total value
                      </InputAdornment>
                    ),
                  }}
                />
              </TableCell>
              <TableCell sx={{ borderBottom: "none" }}>
                <TextField
                  disabled
                  id="outlined-start-adornment"
                  sx={{
                    m: 1,
                    width: "25ch",
                    bgcolor: "#E9ECEF",
                    color: "#212529",
                  }}
                  value={totaleValueB}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ bgcolor: "#E9ECEF", color: "#212529" }}
                      >
                        Total value
                      </InputAdornment>
                    ),
                  }}
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ borderBottom: "none" }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={feesEnabled}
                      onChange={(e) => setFeesEnabled(e.target.checked)}
                    />
                  }
                  label="Fees"
                />
              </TableCell>
            </TableRow>
            {feesEnabled ? (
              <>
                <TableRow>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <FormControl fullWidth>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={feesCoin}
                        onChange={(e) => setFeesCoin(e.target.value)}
                      >
                        {coins.map((c, index) => (
                          <MenuItem key={index} value={c}>
                            {c.symbol}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={2} sx={{ borderBottom: "none" }}>
                    <div className={styles["flex"]}>
                      <TextField
                        id="outlined-start-adornment"
                        sx={{ m: 1, width: "25ch" }}
                        value={feesAmount}
                        onChange={(e) => setFeesAmount(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              sx={{ bgcolor: "#E9ECEF", color: "#212529" }}
                            >
                              Fees Amount
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        disabled
                        id="outlined-start-adornment"
                        sx={{
                          m: 1,
                          width: "25ch",
                          bgcolor: "#E9ECEF",
                          color: "#212529",
                        }}
                        value={feesValue}
                        onChange={(e) => setFeesValue(e.target.value + "$")}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              sx={{ bgcolor: "#E9ECEF", color: "#212529" }}
                            >
                              Fees value
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              </>
            ) : (
              <>
                <TableRow style={{ display: "none" }}>
                  <TableCell></TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div className={styles["modal-footer"]}>
        <Button variant="contained" onClick={handleAddAction}>
          Save Changes
        </Button>
        <Button variant="outlined" onClick={handleClose}>
          Close
        </Button>
      </div>
    </>
  );
}
