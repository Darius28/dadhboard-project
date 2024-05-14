import axios from "axios";
import React, { useState, useEffect, useContext, useRef } from "react";
import { Context } from "../../context";
import { Card, Button, Form, Col, FloatingLabel } from "react-bootstrap";
import { BackendUrl } from "../../utils/BackendUrl";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function SalesOrderDetails() {
  const { state } = useContext(Context);
  const [prod, setProd] = useState();
  const [showInput, setShowInput] = useState(false);
  const [showMinMax, setShowMinMax] = useState(false);
  const { category, itemId } = useParams();
  const customerAddressRef = useRef();
  const customerNameRef = useRef();
  const quantityRef = useRef();
  const salePriceRef = useRef();
  const minRef = useRef();
  const maxRef = useRef();
  const getData = async () => {
    const { data } = await axios.post(
      `${BackendUrl}/get-product`,
      { productId: itemId },
      { withCredentials: true }
    );
    console.log("getData data: ", data);
    setProd(data.product);
  };

  useEffect(() => {
    getData();
  }, []);

  const onSubmitHandler = async () => {
    setShowInput((prevState) => {
      return !prevState;
    });
  };

  const placeSalesOrderHandler = async () => {
    const customerName = customerNameRef.current.value;
    const customerAddress = customerAddressRef.current.value;
    const quantity = quantityRef.current.value;
    const stock = prod.qty_in_stock;
    const salePrice = salePriceRef.current.value;
    if (stock - quantity < 0) {
      toast.error("Quantity cannot be higher than inventory.");
      return;
    }
    const { data } = await axios.post(
      `${BackendUrl}/place-sales-order`,
      {
        productId: itemId,
        productName: prod.product_name,
        productImage: prod.product_image,
        description: prod.description,
        quantity,
        salePrice,
        customerName,
        customerAddress,
        deliveryDate: "To be updated",
        updatedOn: new Date().toLocaleDateString(),
        updatedBy: state.user.name,
        status: "In Progress",
      },
      { withCredentials: true }
    );
    toast.success("Sales order placed successfully!");
  };

  const showMinMaxHandler = () => {
    setShowMinMax((prevState) => {
      return !prevState;
    });
  };

  const setMinMaxHandler = async () => {
    const min = minRef.current.value;
    const max = maxRef.current.value;

    await axios.post(
      `${BackendUrl}/set-min-max-stock`,
      {
        itemId,
        min,
        max,
      },
      { withCredentials: true }
    );
    toast.success("Values set successfully");
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
              <Card.Text>{prod.description}</Card.Text>
              <Card.Title>
                <b>Inventory Stock: </b> {prod.qty_in_stock}
              </Card.Title>
              <Card.Title>
                <b>Cost per piece: </b> {prod.cost}
              </Card.Title>
              <Button variant="primary" onClick={onSubmitHandler}>
                Start Sales Order
              </Button>
              <br />
              <br />
              {showInput && (
                <Form>
                  <Form.Group md="3" className="mb-6">
                    <Form.Control
                      required
                      autoFocus
                      ref={customerNameRef}
                      type="string"
                      placeholder="Enter customer name"
                    />
                  </Form.Group>
                  <br />
                  <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <FloatingLabel
                      controlId="floatingTextarea"
                      label="Address"
                      className="mb-3"
                    >
                      <Form.Control
                        as="textarea"
                        placeholder="Address"
                        ref={customerAddressRef}
                      />
                    </FloatingLabel>
                  </Form.Group>
                  <Form.Group md="3" className="mb-6">
                    <Form.Control
                      required
                      autoFocus
                      ref={quantityRef}
                      type="number"
                      placeholder="Enter quantity"
                    />
                  </Form.Group>
                  <Form.Group md="3" className="mb-6">
                    <Form.Control
                      required
                      autoFocus
                      ref={salePriceRef}
                      type="number"
                      placeholder="Enter selling price"
                    />
                  </Form.Group>
                  <br />
                  <div style={{ textAlign: "center" }}>
                    <Button variant="success" onClick={placeSalesOrderHandler}>
                      Place Sales Order
                    </Button>
                    <Button variant="primary" onClick={showMinMaxHandler}>
                      Set Min and Max Stock
                    </Button>
                  </div>
                </Form>
              )}
              {showMinMax && (
                <>
                  <Form>
                    <Form.Group md="3" className="mb-6">
                      <Form.Control
                        required
                        autoFocus
                        ref={minRef}
                        type="number"
                        placeholder="Enter minimun stock"
                      />
                    </Form.Group>
                    <Form.Group md="3" className="mb-6">
                      <Form.Control
                        required
                        ref={maxRef}
                        type="number"
                        placeholder="Enter maximum stock"
                      />
                    </Form.Group>
                    <Button variant="success" onClick={setMinMaxHandler}>
                      Submit
                    </Button>
                  </Form>
                </>
              )}
            </Card.Body>
          </Card>
        </div>
      )}
    </>
  );
}
