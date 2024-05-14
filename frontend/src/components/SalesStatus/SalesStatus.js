import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context";
import axios from "axios";
import { BackendUrl } from "../../utils/BackendUrl";
import { Table } from "react-bootstrap";

export default function SalesStatus() {
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState();
  const {
    state: { user },
  } = useContext(Context);

  const getData = async () => {
    console.log("getData triggered");
    const { data } = await axios.get(`${BackendUrl}/get-sales-status`, {
      withCredentials: true,
    });
    console.log("sales status data: ", data);
    setSalesData(data);
  };

  useEffect(() => {
    console.log("useEffect in salesStatus triggered");
    getData();
  }, []);

  const closeDeliveryHandler = async (itemData, category) => {
    navigate(`/delivery/${category}/${itemData._id}`);
  };

  return (
    <>
      {salesData && (
        <Table striped bordered hover>
          <thead>
            <th>Sl No</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Selling Price</th>
            <th>Delivery Date</th>
            <th>Updated On</th>
            <th>Updated By</th>
            <th>Status</th>
          </thead>
          <tbody>
            {salesData.map((item, i) => {
              return (
                <tr
                  key={item._id}
                  onClick={
                    user.category === "delivery"
                      ? closeDeliveryHandler.bind(null, item, "delivery")
                      : null
                  }
                >
                  <td>{i + 1}</td>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.sale_price}</td>
                  <td>{item.delivery_date}</td>
                  <td>{item.updated_on}</td>
                  <td>{item.updated_by}</td>
                  <td>{item.status}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </>
  );
}
