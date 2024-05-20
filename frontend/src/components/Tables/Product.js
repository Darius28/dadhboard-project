import React, { useEffect, useState, useContext, useRef } from "react";
import { Context } from "../../context";
import { Table, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BackendUrl } from "../../utils/BackendUrl";
import { toast } from "react-toastify";

export default function Product() {
  const searchRef = useRef();
  const {
    state: { refreshProducts, user },
  } = useContext(Context);

  const navigate = useNavigate();
  const [productsData, setProductsData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [showSearchData, setShowSearchData] = useState(false);
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

  const deleteItemHandler = async (itemId) => {
    const { data } = await axios.post(
      `${BackendUrl}/delete-item`,
      { itemId },
      { withCredentials: true }
    );
    navigate("/dashboard");
    toast.success("Item deteted.");
  };

  const searchProductsHandler = async () => {
    setShowSearchData(true);
    const search = searchRef.current.value;
    console.log(search);
    const { data } = await axios.post(
      `${BackendUrl}/search-item`,
      { search },
      { withCredentials: true }
    );
    console.log("searchData: ", data);
    setSearchData(data);
  };

  const clearSearchHandler = async () => {
    setShowSearchData(false);
    setSearchData([]);
    searchRef.current.value = "";
  };

  return (
    <>
      <h1 className="text-center">List of Products</h1>
      {user.category === "user" ? (
        <div style={{ width: "600px", margin: "auto" }}>
          <InputGroup className="mb-3">
            <Form.Control
              aria-label="Text input with dropdown button"
              ref={searchRef}
            />
            <Button variant="outline-success" onClick={searchProductsHandler}>
              Search Products
            </Button>
            <Button variant="outline-danger" onClick={clearSearchHandler}>
              Clear Search
            </Button>
          </InputGroup>
        </div>
      ) : null}
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
          {user.category === "vendor" ? <th>Action</th> : null}
        </thead>
        <tbody>
          {showSearchData === false
            ? productsData.map((item, i) => {
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
                    {user.category === "vendor" ? (
                      <td>
                        <Button
                          variant="danger"
                          onClick={deleteItemHandler.bind(null, item._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    ) : null}
                  </tr>
                );
              })
            : searchData.map((item, i) => {
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
                    {user.category === "vendor" ? (
                      <td>
                        <Button
                          variant="danger"
                          onClick={deleteItemHandler.bind(null, item._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
        </tbody>
      </Table>
    </>
  );
}
