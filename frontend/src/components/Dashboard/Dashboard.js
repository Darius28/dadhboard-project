import React, { useContext, useRef } from "react";
import { Context } from "../../context";
import Product from "../Tables/Product";
import { Button } from "react-bootstrap";
import PurchaseOrder from "../Tables/PurchaseOrder";
import SalesOrder from "../SalesOrder/SalesOrder";
import { useNavigate } from "react-router-dom";
import SalesStatus from "../SalesStatus/SalesStatus";
import axios from "axios";
import { BackendUrl } from "../../utils/BackendUrl";

export default function Dashboard() {
  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  const showAddProductModalHandler = () => {
    dispatch({
      type: "MODAL_STATUS",
      payload: "add_product",
    });
  };

  const navigate = useNavigate();

  const navToSalesHandler = () => {
    navigate("/sales");
  };

  return (
    <>
      <h1 className="text-center">Dashboard</h1>
      <br />

      <div style={{ textAlign: "center" }}>
        {user.category === "vendor" ? (
          <Button variant="primary" onClick={showAddProductModalHandler}>
            Add Product
          </Button>
        ) : null}
      </div>
      <br />
      {user.category !== "delivery" ? <Product /> : null}

      <br />

      {user.category === "user" ? (
        <>
          <h1 className="text-center">Purchase Orders</h1>
          <br />
          <PurchaseOrder />
          <br />
          <h1 className="text-center">Inventory</h1>
          <br />
          <div style={{ textAlign: "center" }}></div>
          <br />
          <SalesOrder />
          <br />
          <h1 className="text-center">Sales Status</h1>
          <br />
          <SalesStatus />
        </>
      ) : null}

      {user.category === "delivery" ? <SalesStatus /> : null}
    </>
  );
}
