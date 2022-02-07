import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/navBar";
import Home from "./components/Home/home";
import routers from "./router";
function App() {
  return (
    <Router>
      <header>
        <NavBar routers={routers.filter((route) => route.navBar)} />
      </header>

      <Routes>
        {routers.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={route.component}
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
