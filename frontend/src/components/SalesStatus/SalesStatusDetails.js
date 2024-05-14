import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BackendUrl } from "../../utils/BackendUrl";
import { Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";

export default function SalesStatusDetails() {
  const { category, itemId } = useParams();
  const [prod, setProd] = useState();

  const getData = async () => {
    const { data } = await axios.post(
      `${BackendUrl}/get-sales-delivery-status`,
      {
        productId: itemId,
      },
      { withCredentials: true }
    );
    console.log("getData data: ", data);
    setProd(data);
  };

  useEffect(() => {
    getData();
  }, []);

  const markAsDoneHandler = async () => {
    await axios.post(
      `${BackendUrl}/mark-as-delivered`,
      { itemId, deliveryDate: new Date().toLocaleDateString() },
      { withCredentials: true }
    );
    toast.success("Marked as Delivered");
  };

  return (
    <>
      {prod && (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: "5rem",
          }}
        >
          <Card style={{ width: "54rem", height: "50rem", marginTop: "3rem" }}>
            <Card.Img
              variant="top"
              src={prod.product_image.Location}
              style={{
                width: "300px",
                height: "300px",
              }}
            />
            <Card.Body>
              <Card.Title>{prod.product_name}</Card.Title>
              <Card.Text>
                <b>Description: </b>
                {prod.description}
              </Card.Text>
              <Card.Text>
                <b>Customer Name: </b>
                {prod.customer_name}
              </Card.Text>
              <Card.Text>
                <b>Customer Address: </b>
                {prod.customer_address}
              </Card.Text>
              <Card.Text>
                <b>Quantity: </b>
                {prod.quantity}
              </Card.Text>
              <Card.Title>
                <b>Status: </b> {prod.status}
              </Card.Title>
              <br />
            </Card.Body>
            <div style={{ textAlign: "center" }}>
              <Button variant="success" onClick={markAsDoneHandler}>
                Mark as Delivered
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
