import { useContext, useEffect } from "react";
import { Route, useNavigate, Routes } from "react-router-dom";
import axios from "axios";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar/Navbar";
import { BackendUrl } from "./utils/BackendUrl";
import { Context } from "./context";
import { ToastContainer } from "react-toastify";
import Home from "./components/Home/Home";
import Dashboard from "./components/Dashboard/Dashboard";
import ViewProduct from "./components/ViewProduct/ViewProduct";
import SalesOrder from "./components/SalesOrder/SalesOrder";
import SalesOrderDetails from "./components/SalesOrder/SalesOrderDetails";
import SalesStatusDetails from "./components/SalesStatus/SalesStatusDetails";

function App() {
  const { state, dispatch } = useContext(Context);
  const { isLoading } = state;
  const navigate = useNavigate();
  console.log("state in app.js: ", state.user);
  const getSessionStatus = async (uid) => {
    console.log("get session status in app.js");
    const { data } = await axios.post(`${BackendUrl}/get-session-status`, {
      userId: uid,
    });

    if (data.ok === false) {
      console.log("session expired");

      dispatch({
        type: "LOGOUT",
      });
      localStorage.removeItem("user");
      const { data } = await axios.post(`${BackendUrl}/logout`, {
        userId: uid,
      });
      navigate("/");
    }
  };

  useEffect(() => {
    const LS = JSON.parse(localStorage.getItem("user"));
    if (LS) {
      const userId = LS._id;
      if (!state.user) {
        getSessionStatus(userId);
      }
    }
  }, []);

  return (
    <>
      <ToastContainer position="top-center" />
      <div className="App">
        <Navbar />
        <Routes>
          {state.user ? (
            <>
              {state.user.category === "user" && (
                <>
                  <Route path="/" Component={Home} exact />
                </>
              )}

              <Route path="/dashboard" Component={Dashboard} exact />
              <Route
                path="/dashboard/:category/:itemId"
                Component={ViewProduct}
                exact
              />
              <Route path="/sales" Component={SalesOrder} exact />
              <Route
                path="/sales/:category/:itemId"
                Component={SalesOrderDetails}
                exact
              />
              <Route
                path="/delivery/:category/:itemId"
                Component={SalesStatusDetails}
                exact
              />
            </>
          ) : null}
        </Routes>
      </div>
    </>
  );
}

export default App;
