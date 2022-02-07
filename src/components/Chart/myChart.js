import React, { useState, useEffect } from "react";
import { Scatter } from "react-chartjs-2";
import dragdataPlugin from "./chartjs-plugin-dragdata";
import zoomPlugin from "chartjs-plugin-zoom";
import { Chart, registerables } from "chart.js";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import TextField from "@mui/material/TextField";
import DateFnsUtils from "@date-io/date-fns";
import { useDispatch } from "react-redux";
import { ADD_EDIT_CHART_TO_Projection } from "../../redux/projections/projection.types";
import { ReactComponent as DeleteIcon } from "./../../assets/icons/delete.svg";
import { ReactComponent as AddIcon } from "./../../assets/icons/add.svg";
import { ReactComponent as NextIcon } from "./../../assets/icons/next.svg";
import { ReactComponent as PrevIcon } from "./../../assets/icons/prev.svg";
import { ReactComponent as EndIcon } from "./../../assets/icons/end.svg";
import { ReactComponent as FirstIcon } from "./../../assets/icons/first.svg";
import "./myChart.scss";

export default function MyChart({projection}) {
  Chart.register(...registerables, dragdataPlugin, zoomPlugin);

  const dispatch = useDispatch();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [isDraggingPoint, setIsDraggingPoint] = useState();
  const [yMax, setYMax] = useState();
  const [error, setError] = useState(false);

  // Formated Date to total minute
  const dateToMin = (a) => {
    const formatDate = new Date(a);
    const min = formatDate.getTime() / 60;
    return min;
  };

  // Total minute to formatted date
  const minToDate = (min) => {
    const date = new Date(min);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return year + "/" + month + "/" + day;
  };

  // Total minute to other type of formatted date
  const minToFormatedDate = (min) => {
    const date = new Date(min);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return day + " " + months[month] + " " + year;
  };

  const [mixedData, setMixedData] = useState(projection.chart);
  const [selectAssets, setSelectAssets] = useState(mixedData[0]);

  // Set y max value
  useEffect(() => {
    let newArray = [];
    mixedData
      .find((item) => item.label === selectAssets.label)
      .mainData.map((item, index) => {
        return newArray.push(item.y);
      });
    const ymax = Math.max(...newArray);
    setYMax(Math.ceil(ymax * 1.5));
  }, [mixedData, isDraggingPoint, selectAssets.label]);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addDate, setAddDate] = useState(null);
  const [addPrice, setAddPrice] = useState();

  // Perpage select option
  const selectOption = [
    { label: "5", value: 5 },
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "All", value: "all" },
  ];

  // Select the number of per page
  const onSelectPage = (e) => {
    if (e.target.value === "all") {
      setRowsPerPage(
        mixedData.find((item) => item.label === selectAssets.label).mainData
          .length
      );
      setPage(0);
    } else {
      setRowsPerPage(e.target.value);
      setPage(0);
    }
  };

  /** Begin pagination button functions */
  const onFirst = () => {
    setPage(0);
  };

  const onLast = () => {
    setPage(
      Math.floor(
        mixedData.find((item) => item.label === selectAssets.label).mainData
          .length / rowsPerPage
      )
    );
  };

  const onPrevious = () => {
    if (page === 0) {
      return;
    }
    setPage((state) => state - 1);
  };

  const onNext = () => {
    if (
      page >=
      Math.floor(
        mixedData.find((item) => item.label === selectAssets.label).mainData
          .length / rowsPerPage
      )
    ) {
      return;
    } else {
      setPage((state) => state + 1);
    }
  };
  /** End pagination button functions */

  // Adding price data in table
  const onPrice = (e) => {
    setAddPrice(parseFloat(e.target.value));
  };

  // Add one point in table
  const onAdd = () => {
    if (!addDate || !addPrice) {
      setError(true);
      return;
    } else {
      setError(false);
    }
    const tmpData = mixedData.map((item) => {
      if (item.label === selectAssets.label) {
        return {
          ...item,
          mainData: [...item.mainData, { x: addDate / 60, y: addPrice }].sort(
            (a, b) => a.x - b.x
          ),
        };
      } else {
        return item;
      }
    });
    setMixedData(tmpData);
    projection.chart=tmpData
    dispatch({ type: ADD_EDIT_CHART_TO_Projection, payload: projection });
    setAddPrice("");
    setAddDate(null);
  };

  // Remove one point from table
  const onRemove = (key) => {
    const tmp = mixedData.map((items) => {
      if (items.label === selectAssets.label) {
        console.log("tmpData");
        const tmpData = {
          ...items,
          mainData: items.mainData.filter((item) => item.x !== key),
        };
        return tmpData;
      } else {
        return items;
      }
    });
    setMixedData(tmp);
    projection.chart=tmp
    dispatch({ type: ADD_EDIT_CHART_TO_Projection, payload: projection });
  };

  // Price editing function in per row
  const changePricePerRow = (e, id) => {
    const tmp = mixedData.map((item) => {
      if (item.label === selectAssets.label) {
        const mD = item.mainData.map((i, index) => {
          if (index === id) {
            return { x: i.x, y: e.target.value };
          } else {
            return i;
          }
        });
        return { ...item, mainData: mD };
      } else {
        return item;
      }
    });
    setMixedData(tmp);
    projection.chart=tmp
    dispatch({ type: ADD_EDIT_CHART_TO_Projection, payload: projection });
  };

  // Date editing function in per row
  const changeDatePerRow = (newDate, id) => {
    const tmp = mixedData.map((item) => {
      if (item.label === selectAssets.label) {
        const mD = item.mainData.map((i, index) => {
          if (index === id) {
            return { x: dateToMin(newDate), y: i.y };
          } else {
            return i;
          }
        });
        return { ...item, mainData: mD };
      } else {
        return item;
      }
    });
    setMixedData(tmp);
    projection.chart=tmp
    dispatch({ type: ADD_EDIT_CHART_TO_Projection, payload: projection });
  };

  // Click functino when select coin
  const handleSelectCoin = (label) => {
    const selectedData = mixedData.find((item) => item.label === label);
    setSelectAssets(selectedData);
  };

  // Chart main optinos
  const options = {
    responsive: true,
    title: {
      display: true,
      text: "Chart.js Time Scale",
    },
    scales: {
      y: {
        beginAtZero: true,
        max: yMax,
        stepSize: 0.01,
        title: {
          text: "Price in dollar",
          display: true,
        },
      },
      x: {
        ticks: {
          callback: function (value, index, ticks) {
            return minToDate(value * 60);
          },
        },
      },
    },
    lineTension: 0.1,
    hover: {
      mode: "dataset",
    },
    datasets: {
      scatter: {
        borderWidth: 2.5,
        fill: false,
        pointRadius: 5,
        pointHitRadius: 5,
        showLine: true,
      },
    },
    pointHoverRadius: 3,
    plugins: {
      zoom: {
        limits: {
          x: { min: "original" },
          y: { min: "original" },
        },
        zoom: {
          wheel: {
            enabled: true, // SET SCROLL ZOOM TO TRUE
          },
          mode: "x",
          speed: 20,
        },
        pan: {
          enabled: true,
          mode: "x",
          onPanStart(event) {
            if (isDraggingPoint) {
              return false;
            }
          },
        },
      },
      tooltip: {
        yAlign: "bottom",
        borderColor: "#bab4cab5",
        borderWidth: 0.5,
        textDirection: "ltr",
        displayColors: false,
        callbacks: {
          label: function (context) {
            let label = "Date: " + minToDate(context.parsed.x * 60);
            return label;
          },
          afterLabel: function (context) {
            let label = "Price: " + context.parsed.y;
            return label;
          },
          beforeLabel: function (context) {
            let label = context.dataset.label;
            return label;
          },
        },
      },
      dragData: {
        round: 1,
        dragX: true,
        showTooltip: true,
        onDragStart: (e, datasetIndex, index, value) => {
          setIsDraggingPoint(true);
        },
        onDragEnd: (e, datasetIndex, index, value) => {
          setIsDraggingPoint(false);
          projection.chart=mixedData
          dispatch({ type: ADD_EDIT_CHART_TO_Projection, payload: projection });
        },
      },
      legend: {
        display: false,
      },
    },
  };

  // Chart data
  const data = {
    datasets: [
      {
        label: selectAssets.label,
        pointRadius: 2,
        pointHoverRadius: 4,
        data: mixedData.find((item) => item.label === selectAssets.label)
          .mainData,
        fill: false,
        borderColor: selectAssets.color || "#a8e10f",
        backgroundColor: selectAssets.color || "#a8e10f",
      },
    ],
  };

  return (
    <div className="main">
      <p>
      Before to simulate action like swap, stake, etc ... you need to determine future price of your portfolio asset's<br></br>You can edit your portfolio and future price, but this may have an influence on your actions which may no longer be valid due to a change in asset prices.
      </p>
      <div className="legends-container">
        {mixedData &&
          mixedData.map((item, index) => (
            <div
              onClick={() => handleSelectCoin(item.label)}
              className={`legends ${
                selectAssets.label !== item.label && "blur"
              }`}
              key={index}
            >
              <div
                className="legend-box"
                style={{ backgroundColor: `${item.color}` }}
              ></div>
              <p>{item.label}</p>
            </div>
          ))}
      </div>
      <div className="chartContainer">
        <Scatter options={options} data={data} />
      </div>
      <div className="main-container">
        <div className="flexChart">
          <table >
            <thead>
              <tr>
                <th>Date</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mixedData
                .find((item) => item.label === selectAssets.label)
                .mainData.sort((a, b) => a.x - b.x)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => {
                  const id = index + rowsPerPage * page;
                  return (
                    <tr key={id}>
                      <td className="date-input table-input">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            inputFormat="dd MMMM yyyy"
                            value={minToFormatedDate(item.x * 60)}
                            onChange={(e) => changeDatePerRow(e, id)}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </LocalizationProvider>
                      </td>
                      <td className="price-input table-input">
                        <input
                          value={item.y}
                          type="number"
                          placeholder="Price"
                          onChange={(newValue) => changePricePerRow(newValue, id)}
                        />
                      </td>
                      <td className="action-td" onClick={() => onRemove(item.x)}>
                        <DeleteIcon />
                      </td>
                    </tr>
                  );
                })}
              <tr>
                <td className="date-input">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={addDate}
                      onChange={(newValue) => {
                        const minValue = Date.parse(newValue);
                        setAddDate(minValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </td>
                <td className="price-input">
                  <input
                    value={addPrice}
                    type="number"
                    placeholder="Price"
                    onChange={(e) => onPrice(e)}
                  />
                </td>
                <td className="action-td" onClick={() => onAdd()}>
                  <AddIcon />
                </td>
              </tr>
            </tbody>
          </table>
          <p>You can add/edit price directly on the chart with draggable point or by clicking on the chart to add a new price or if you prefer, you can add or edit point in the table directly</p>       
        </div>
        <div className="badge-container">
          <p className="total-data-number">
            Total points{" "}
            {
              mixedData.find((item) => item.label === selectAssets.label)
                .mainData.length
            }
          </p>
          <p className={error ? "show-error" : "hide-error"}>Invalid data</p>
        </div>
        <div className="pagination-container">
          <div className="select-page">
            <p>Per page</p>
            <select name="perpage" id="perpage" onChange={onSelectPage}>
              {selectOption &&
                selectOption.map((item, index) => (
                  <option value={item.value} key={index}>
                    {item.label}
                  </option>
                ))}
            </select>
          </div>
          <div className="buttons-container">
            <button variant="outlined" size="medium" onClick={onFirst}>
              <FirstIcon />
            </button>
            <button variant="outlined" onClick={onPrevious}>
              <PrevIcon />
            </button>
            <button variant="outlined" onClick={onNext}>
              <NextIcon />
            </button>
            <button variant="outlined" onClick={onLast}>
              <EndIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
