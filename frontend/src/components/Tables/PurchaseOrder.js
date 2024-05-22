import React, { useContext, useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Context } from "../../context";
import axios from "axios";
import { BackendUrl } from "../../utils/BackendUrl";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function PurchaseOrder() {
  const navigate = useNavigate();
  const {
    state: { refreshProducts, user },
  } = useContext(Context);
  const [productsData, setProductsData] = useState([]);

  const getData = async () => {
    const { data } = await axios.post(
      `${BackendUrl}/get-purchase-orders`,
      { userId: user._id },
      {
        withCredentials: true,
      }
    );
    console.log("productsData", data);
    setProductsData(data);
    return data;
  };

  useEffect(() => {
    getData();
    console.log("inside useEffect: ", productsData);
  }, [refreshProducts]);

  const handleStatusHandler = (itemData, type) => {
    navigate(`/dashboard/${type}/${itemData._id}`);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(productsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "purchase-order.xlsx");
  };

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <Button variant="success" onClick={exportToExcel}>
          Export Data (.csv)
        </Button>
      </div>
      <br />
      <Table striped bordered hover>
        <thead>
          <th>Sl No</th>
          <th>Product Name</th>
          <th>Description</th>
          <th>Quantity</th>
          <th>Cost</th>
          <th>Vendor Name</th>
          <th>Vendor Address</th>
          <th>Purchase Date</th>
          <th>Delivery Date</th>
          <th>Updated By</th>
          <th>Updated On</th>
          <th>Status</th>
        </thead>
        <tbody>
          {productsData.map((item, i) => {
            return (
              <tr
                key={item._id}
                onClick={handleStatusHandler.bind(null, item, "purchaseOrder")}
              >
                <td>{i + 1}</td>
                <td>{item.product_name}</td>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{item.cost}</td>
                <td>{item.vendor_name}</td>
                <td>{item.vendor_address}</td>
                <td>{item.purchase_date}</td>
                <td>{item.delivery_date}</td>
                <td>{item.updated_by}</td>
                <td>{item.updated_on}</td>
                <td>{item.status}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}
