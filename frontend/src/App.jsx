import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

//Pages
import Home from "./pages/Home"
import Login from "./pages/Login";
import Registration from "./pages/Registration";


function App() {

  return (
    <div className="dark">
        <Router>
          <Routes>
            <Route
              exact
              path="/"
              element={<Home /> }              
            />
            <Route
              exact
              path="/login"
              element={<Login />}
            />
            <Route
              exact
              path="/registration"
              element={<Registration />}
            />
          </Routes>
        </Router>
    </div>
  );
}

export default App
