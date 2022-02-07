import {
  ADD_Projection,
  EDIT_Projection,
  ADD_ACTION_TO_Projection,
  EDIT_ACTION_TO_Projection,
  DELETE_ACTION_TO_Projection,
  ADD_EDIT_CHART_TO_Projection,
  DELETE_Projection,
} from "./projection.types";
import moment from "moment";
const INITIAL_STATE = {
  projections: JSON.parse(localStorage.getItem("projections")) || [],
  project: null,
};
function getRandomColor() {
  var letters = "0123456789ABCDEF".split("");
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const dateToMin = (a) => {
  const formatDate = new Date(a);
  const min = formatDate.getTime() / 60;
  return min;
};
const isChartExist = (label, array) =>
  array.filter((elem) => elem.label === label);
const reducer = (state = INITIAL_STATE, action) => {
  let projects, projectEdit;
  switch (action.type) {
    case ADD_Projection:
      const project = action.payload;
      project.id = state.projections.length;
      project.actions = [];
      project.chart = [];
      project.status = [
        {
          date: project.startDate,
          coins: project.coins,
        },
        {
          date: project.endDate,
          coins: project.coins,
        },
      ];
      project.coins.forEach((element) => {
        project.chart.push({
          label: element.symbol,
          color: getRandomColor(),
          mainData: [
            {
              date: project.startDate,
              x: dateToMin(project.startDate),
              y: element.currentPrice,
              init: true,
            },
            {
              date: project.endDate,
              x: dateToMin(project.endDate),
              y: element.currentPrice,
              init: true,
            },
          ],
        });
      });
      const projections = [...state.projections, project];
      localStorage.setItem("projections", JSON.stringify(projections));
      return {
        ...state,
        projections,
      };
    case EDIT_Projection:
      projects = state.projections;
      projectEdit = action.payload;
      projectEdit.coins.forEach((element) => {
        let oldChart = isChartExist(element.symbol, projectEdit.chart);
        console.log(oldChart);
        if (oldChart.length !== 0) {
          [oldChart] = oldChart;
          oldChart.mainData = oldChart.mainData.map((d) => {
            if (
              d.init &&
              (moment(d.date).format("YYYY-MM-DD") ===
                moment(projectEdit.startDate).format("YYYY-MM-DD") ||
                moment(d.date).format("YYYY-MM-DD") ===
                  moment(projectEdit.endDate).format("YYYY-MM-DD"))
            ) {
              d.y = element.currentPrice;
            }
            return d;
          });
          projectEdit.chart = projectEdit.chart.map((elem) => {
            if (elem.label === oldChart.label) {
              elem = oldChart;
            }
            return elem;
          });
        } else
          projectEdit.chart.push({
            label: element.symbol,
            color: getRandomColor(),
            mainData: [
              {
                x: dateToMin(projectEdit.startDate),
                y: element.currentPrice,
                init: true,
              },
              {
                x: dateToMin(projectEdit.endDate),
                y: element.currentPrice,
                init: true,
              },
            ],
          });
      });
      projectEdit.status[projectEdit.status.length-1].coins=projectEdit.coins
      projects[projectEdit.id] = projectEdit;
      localStorage.setItem("projections", JSON.stringify(projects));
      return {
        ...state,
        projections: projects,
      };
    case DELETE_Projection:
      projects = state.projections;
      const projectDelete = action.payload;
      console.log(projectDelete);
      projects = projects.filter((prj) => prj.id !== projectDelete.id);
      localStorage.setItem("projections", JSON.stringify(projects));
      return {
        ...state,
        projections: projects,
      };
    case ADD_ACTION_TO_Projection:
      projects = state.projections;
      projectEdit = action.payload.projection;
      projects[projectEdit.id].actions.push(action.payload.action);
      localStorage.setItem("projections", JSON.stringify(projects));
      return {
        ...state,
        projections: projects,
      };
    case DELETE_ACTION_TO_Projection:
      projects = state.projections;
      projectEdit = action.payload.projection;
      const act = action.payload.action;
      projects[projectEdit.id].actions = projects[
        projectEdit.id
      ].actions.filter((acti) => act.id !== acti.id);
      localStorage.setItem("projections", JSON.stringify(projects));
      return {
        ...state,
        projections: projects,
      };
    case ADD_EDIT_CHART_TO_Projection:
      projects = state.projections;
      projects[action.payload.id] = action.payload;
      localStorage.setItem("projections", JSON.stringify(projects));
      return {
        ...state,
        projections: projects,
      };
    default:
      return state;
  }
};

export default reducer;
