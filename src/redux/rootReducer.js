import { combineReducers } from "redux";
import projectionReducer from "./projections/projection.reducer";

const rootReducer = combineReducers({
  projection: projectionReducer,
});

export default rootReducer;
