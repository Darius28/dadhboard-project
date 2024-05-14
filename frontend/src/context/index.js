import { useReducer, createContext, useEffect } from "react";
import axios from "axios";
import { BackendUrl } from "../utils/BackendUrl";

const initialState = {
  user: null,
  showModal: null,
  refreshProducts: null,
};

const Context = createContext();

const rootReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN": {
      return { ...state, user: action.payload };
    }
    case "MODAL_STATUS": {
      let value;
      if (state.showModal === null) {
        value = action.payload;
      } else {
        value = null;
      }
      return { ...state, showModal: value };
    }
    case "LOGOUT":
      return { ...state, user: null, cartLength: null };

    case "REFRESH_PRODUCTS": {
      return { ...state, refreshProducts: action.payload };
    }
    case "IS_ADMIN": {
      return { ...state, isAdmin: action.payload };
    }
    default:
      return state;
  }
};

const Provider = (props) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  useEffect(() => {
    const LS = JSON.parse(localStorage.getItem("user"));
    if (LS) {
      dispatch({
        type: "LOGIN",
        payload: LS,
      });
    }
  }, []);

  return (
    <Context.Provider value={{ state, dispatch }}>
      {props.children}
    </Context.Provider>
  );
};

export { Context, Provider };
