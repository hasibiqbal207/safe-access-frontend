import { useSelector } from "react-redux";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

//Pages
import Home from "./pages/Home"
import Login from "./pages/Login";
import Registration from "./pages/Registration";


function App() {
  const {user} = useSelector((state) => state.user);
  const {token} = user; 

  return (
    <div className="dark">
        <Router>
          <Routes>
            <Route
              exact
              path="/"
              element={token ? <Home /> : <Navigate to="/login" />}              
            />
            <Route
              exact
              path="/login"
              element={!token ? <Login /> : <Navigate to="/" />}
            />
            <Route
              exact
              path="/registration"
              element={!token ? <Registration /> : <Navigate to="/" />}
            />
          </Routes>
        </Router>
    </div>
  );
}

export default App
