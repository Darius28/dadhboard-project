import axios from "axios";
import React, { useContext } from "react";
import { Chart } from "react-google-charts";
import { BackendUrl } from "../../utils/BackendUrl";
import Sales from "../Graph/Sales";
import Orders from "../Graph/Orders";
import { Context } from "../../context";

export default function Home() {
  const { state, dispatch } = useContext(Context);
  return (
    <>
      <h1 style={{ textAlign: "center" }}>Home</h1>
      {state.user.category === "user" ? (
        <div style={{ display: "flex" }}>
          <Orders />
          <Sales />
        </div>
      ) : null}
    </>
  );
}
