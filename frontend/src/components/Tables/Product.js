import React, { useEffect, useState, useContext } from "react";
import { Context } from "../../context";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BackendUrl } from "../../utils/BackendUrl";

export default function Product() {
  const {
    state: { refreshProducts, user },
  } = useContext(Context);

  const navigate = useNavigate();
  const [productsData, setProductsData] = useState([]);
  const getData = async () => {
    const { data } = await axios.post(
      `${BackendUrl}/get-products`,
      { vendorId: user._id, vendorCategory: user.category },
      {
        withCredentials: true,
      }
    );
    console.log(data);
    setProductsData(data);
    return data;
  };

  useEffect(() => {
    getData();
    console.log("inside useEffect: ", productsData);
  }, [refreshProducts]);

  const descriptionHandler = (itemData, type) => {
    navigate(`/dashboard/${type}/${itemData._id}`);
    console.log("descriptionHandler: ", itemData);
  };

  return (
    <>
      <h1 className="text-center">List of Products</h1>
      <Table striped bordered hover>
        <thead>
          <th>Sl No</th>
          <th>Product ID</th>
          <th>Product</th>
          <th>Description</th>
          <th>Cost</th>
          <th>Stock</th>
          <th>Updated By</th>
          <th>Updated On</th>
        </thead>
        <tbody>
          {productsData.map((item, i) => {
            return (
              <tr
                key={item._id}
                onClick={descriptionHandler.bind(null, item, "product")}
              >
                <td>{i + 1}</td>
                <td>{item._id}</td>
                <td>{item.product_name}</td>
                <td>{item.description}</td>
                <td>{item.cost}</td>
                <td>{item.stock}</td>
                <td>{item.updated_by}</td>
                <td>{item.updated_on}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}
