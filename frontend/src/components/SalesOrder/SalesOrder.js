import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { Table } from "react-bootstrap";
import { BackendUrl } from "../../utils/BackendUrl";
import { Context } from "../../context";
import { useNavigate } from "react-router-dom";

export default function SalesOrder() {
  const navigate = useNavigate();
  const [productsData, setProductsData] = useState([]);
  const {
    state: { user },
  } = useContext(Context);
  const getData = async () => {
    const { data } = await axios.post(
      `${BackendUrl}/get-products`,
      { vendorId: user._id, vendorCategory: user.category },
      {
        withCredentials: true,
      }
    );
    console.log("InventoryData: ", data);
    setProductsData(data);

    return data;
  };

  useEffect(() => {
    getData();
    console.log("inside useEffect: ", productsData);
  }, []);

  const descriptionHandler = (itemData, type) => {
    navigate(`/sales/${type}/${itemData._id}`);
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <th>Sl No</th>
          <th>FProduct</th>
          <th>Description</th>
          <th>Cost</th>
          <th>Stock</th>
          <th>Updated By</th>
          <th>Updated On</th>
          <th>Inventory Stock</th>
          <th>Inventory Alert</th>
        </thead>
        <tbody>
          {productsData.map((item, i) => {
            return (
              <tr
                key={item._id}
                onClick={descriptionHandler.bind(null, item, "sales")}
              >
                <td>{i + 1}</td>
                <td>{item.product_name}</td>
                <td>{item.description}</td>
                <td>{item.cost}</td>
                <td>{item.stock}</td>
                <td>{item.updated_by}</td>
                <td>{item.updated_on}</td>
                <td>{item.qty_in_stock}</td>
                <td
                  style={{
                    backgroundColor: !item.min_stock
                      ? ""
                      : item.qty_in_stock < item.min_stock
                      ? "red"
                      : item.qty_in_stock > item.max_stock
                      ? "green"
                      : "yellow",
                  }}
                ></td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}
