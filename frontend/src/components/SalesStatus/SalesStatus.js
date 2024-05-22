import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context";
import axios from "axios";
import { BackendUrl } from "../../utils/BackendUrl";
import { Table, Button } from "react-bootstrap";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(salesData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "sales-order.xlsx");
  };

  return (
    <>
      {salesData && (
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
        </>
      )}
    </>
  );
}
