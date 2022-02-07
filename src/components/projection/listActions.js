import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import moment from "moment";
import {
  EDIT_ACTION_TO_Projection,
  DELETE_ACTION_TO_Projection,
} from "../../redux/projections/projection.types";
import { useDispatch } from "react-redux";

function ModalEdit() {}

function CardItem({ action, projection }) {
  const dispatch = useDispatch();
  const sign = action.price - action.coin.currentPrice >= 0 ? "+" : "-";
  const getVariation =
    (Math.abs(action.price - action.coin.currentPrice) /
      action.coin.currentPrice) *
    100;
  const deleteAction = () => {
    if (window.confirm("Are you sure ?"))
      dispatch({
        type: DELETE_ACTION_TO_Projection,
        payload: { action, projection },
      });
  };
  const editAction = () => {};

  return (
    <React.Fragment>
      <CardContent>
        <Typography variant="h5" component="div">
          ${action.coin.symbol}/Price variation
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {moment(action.date).format("DD MMMM YYYY")}
        </Typography>
        <Typography variant="body2">
          New Price : {action.price}$({sign}
          {getVariation}%)
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" onClick={editAction}>
          Edit
        </Button>
        <Button variant="contained" onClick={deleteAction}>
          Delete
        </Button>
      </CardActions>
    </React.Fragment>
  );
}

export default function ListActions({ projections }) {
  return (
    <>
      {projections.map((prj, index) => {
        return (
          <React.Fragment key={index}>
            {prj.actions?.length > 0 ? (
              <>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ margin: "20px auto" }}
                >
                  Projection : {prj.name}
                </Typography>
                <Box
                  sx={{
                    minWidth: 275,
                    margin: "20px auto",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {prj.actions.map((act, index) => {
                    return (
                      <Card
                        sx={{ width: "fit-content" }}
                        key={index}
                        variant="outlined"
                      >
                        <CardItem action={act} projection={prj} />
                      </Card>
                    );
                  })}
                </Box>
              </>
            ) : (
              ""
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}
