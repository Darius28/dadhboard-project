import axios from "axios";
import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { BackendUrl } from "../../utils/BackendUrl";
import { Button, Card, Form } from "react-bootstrap";
import { Context } from "../../context";
import { toast } from "react-toastify";

export default function ViewProduct() {
  const { state } = useContext(Context);
  const [prod, setProd] = useState();
  const [showCount, setShowCount] = useState(false);
  const orderCountRef = useRef();
  const productNameRef = useRef();
  const productCostRef = useRef();
  const productStockRef = useRef();
  const productDescriptionRef = useRef();
  const { category, itemId } = useParams();
  console.log(category, itemId);
  const [showEditFields, setShowEditFields] = useState(false);

  const getData = async () => {
    var data2;
    if (category === "purchaseOrder") {
      console.log("purchaseOrder executed");
      data2 = await axios.post(
        `${BackendUrl}/get-purchase-order`,
        { productId: itemId },
        { withCredentials: true }
      );
      console.log(data2.data.product);
      setProd(data2.data);
    } else {
      console.log("getProduct executed");
      data2 = await axios.post(
        `${BackendUrl}/get-product`,
        { productId: itemId },
        { withCredentials: true }
      );
      console.log(data2.data);
      setProd(data2.data.product);
    }

    // const { data } = await axios.post(
    //   `${BackendUrl}/get-product`,
    //   { productId: itemId },
    //   { withCredentials: true }
    // );
  };

  const setCountHandler = async () => {
    if (category === "purchaseOrder") {
      const { data } = await axios.post(
        `${BackendUrl}/mark-purchase-order-as-complete`,
        {
          productId: itemId,
          userName: state.user.name,
          updatedOn: new Date().toLocaleDateString(),
          quantity: prod.quantity,
          itemId: prod.product_id,
        },
        { withCredentials: true }
      );

      toast.success("Marked as completed");
    } else {
      setShowCount((prevState) => {
        return !prevState;
      });
    }
  };

  const placePushcaseOrderHandler = async () => {
    const quantity = orderCountRef.current.value;
    const category = state.user.category;
    console.log(state.user.name);
    if (category === "vendor") {
      const { data } = await axios.post(
        `${BackendUrl}/update-stock-quantity`,
        {
          productId: prod._id,
          userName: state.user.name,
          newStock: orderCountRef.current.value,
          updatedOn: new Date().toLocaleDateString(),
        },
        { withCredentials: true }
      );
      console.log("order placed");
      toast.success("Stock Updated Successfully!");
      orderCountRef.current.value = "";
    } else {
      const stock = prod.stock;
      if (stock - quantity < 0) {
        toast.error("Stocks limited. Select a lesser number.");
        return;
      }
      const { data } = await axios.post(
        `${BackendUrl}/place-purchase-order`,
        {
          userId: state.user._id,
          userName: state.user.name,
          productId: prod._id,
          quantity,
          oldStock: stock,
          cost: prod.cost * quantity,
          purchaseDate: new Date().toLocaleDateString(),
          deliveryDate: "To be updated",
          updatedOn: new Date().toLocaleDateString(),
          updatedBy: state.user.name,
          status: "In Progress",
          productName: prod.product_name,
          productImage: prod.product_image,
          description: prod.description,
        },
        { withCredentials: true }
      );
      toast.success("Purchase Order placed successfully!");
    }
  };

  const editVendorItemHandler = async () => {
    const newProductName = productNameRef.current.value;
    const newProductCost = productCostRef.current.value;
    const newProductDescription = productDescriptionRef.current.value;
    const newProductStock = productStockRef.current.value;

    console.log(
      newProductName === "",
      newProductCost === "",
      newProductDescription === "",
      newProductStock === ""
    );

    var varsToModify = [];

    if (newProductName !== "")
      varsToModify.push({ field: "product_name", value: newProductName });

    if (newProductCost !== "")
      varsToModify.push({ field: "cost", value: newProductCost });

    if (newProductDescription !== "")
      varsToModify.push({
        field: "description",
        value: newProductDescription,
      });

    if (newProductStock !== "")
      varsToModify.push({ field: "stock", value: newProductStock });

    console.log("array: ", varsToModify);

    await axios.post(
      `${BackendUrl}/update-vendor-item`,
      { varsToModify, itemId },
      { withCredentials: true }
    );
    toast.success("Product updated successfully");
    productNameRef.current.value = "";
    productCostRef.current.value = "";
    productDescriptionRef.current.value = "";
    productStockRef.current.value = "";
  };

  const showEditFieldsHandler = () => {
    setShowEditFields((prevState) => {
      return !prevState;
    });
  };

  useEffect(() => {
    getData();
  }, []);

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
          <Card style={{ width: "54rem", height: "60rem", marginTop: "3rem" }}>
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
              {category === "purchaseOrder" ? (
                <Card.Title>
                  <b>Status:</b> {prod.status}
                </Card.Title>
              ) : (
                <Card.Title>
                  <b>Stock:</b> {prod.stock}
                  <br />
                  <b>Price: </b>
                  {prod.cost}
                </Card.Title>
              )}
              {/* {state.user.category === "vendor" ? (
                <Card.Title>
                  <b>Stock:</b> {prod.stock}
                </Card.Title>
              ) : state.user.category === "user" ? (
                <Card.Title>
                  <b>Stock:</b> {prod.stock}
                </Card.Title>
              ) : (
                <Card.Title>
                  <b>Status:</b> {prod.status}
                </Card.Title>
              )} */}

              {prod.status && prod.status === "Completed" ? null : (
                <Button variant="primary" onClick={setCountHandler}>
                  {state.user.category === "vendor"
                    ? "Edit Stock Quantity"
                    : state.user.category === "user" &&
                      category === "purchaseOrder"
                    ? "Set status as complete"
                    : "Enter Purchase Order Quantity"}
                </Button>
              )}

              <br />
              <br />
              {showCount && (
                <>
                  <Form>
                    <Form.Group md="3" className="mb-6">
                      <Form.Control
                        required
                        autoFocus
                        ref={orderCountRef}
                        type="number"
                        placeholder="Enter additional units procured"
                      />
                    </Form.Group>
                  </Form>
                  <br />
                  <div style={{ textAlign: "center" }}>
                    <Button
                      variant="success"
                      onClick={placePushcaseOrderHandler}
                    >
                      Place Purchase Order
                    </Button>
                  </div>
                  <br />
                  <Button variant="primary" onClick={showEditFieldsHandler}>
                    Click to edit product details
                  </Button>
                  {showEditFields && (
                    <>
                      <h3 style={{ textAlign: "center" }}>
                        Only enter new field values
                      </h3>
                      <Form>
                        <Form.Group md="3" className="mb-6">
                          <Form.Control
                            ref={productNameRef}
                            type="string"
                            placeholder="Enter product name"
                          />
                        </Form.Group>
                        <Form.Group md="3" className="mb-6">
                          <Form.Control
                            ref={productDescriptionRef}
                            type="string"
                            placeholder="Enter product description"
                          />
                        </Form.Group>
                        <Form.Group md="3" className="mb-6">
                          <Form.Control
                            ref={productCostRef}
                            type="number"
                            placeholder="Enter product cost"
                          />
                        </Form.Group>
                        <Form.Group md="3" className="mb-6">
                          <Form.Control
                            ref={productStockRef}
                            type="number"
                            placeholder="Enter product stock"
                          />
                        </Form.Group>
                        <Button
                          variant="success"
                          onClick={editVendorItemHandler}
                        >
                          Edit Items
                        </Button>
                      </Form>
                    </>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </div>
      )}
    </>
  );
}
