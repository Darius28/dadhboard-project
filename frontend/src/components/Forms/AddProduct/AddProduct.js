import React, { useRef, useState, useContext } from "react";
import { Form, FloatingLabel, Button } from "react-bootstrap";
import { Transition } from "react-transition-group";
import Resizer from "react-image-file-resizer";
import { BackendUrl } from "../../../utils/BackendUrl";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../../../context";

export default function AddProduct() {
  const productRef = useRef();
  const descriptionRef = useRef();
  const costRef = useRef();
  const stockRef = useRef();
  const [imgUri, setImgUri] = useState("");

  const { state, dispatch } = useContext(Context);

  const addImageHandler = (e) => {
    console.log(e.target.files[0]);
    const previewUrl = window.URL.createObjectURL(e.target.files[0]);
    console.log("previewUrl", previewUrl);
    Resizer.imageFileResizer(
      e.target.files[0],
      858,
      432,
      "JPEG",
      100,
      0,
      async (uri) => {
        console.log("uri: ", uri);
        setImgUri(uri);
      }
    );
  };

  const addProductHandler = async () => {
    const product = productRef.current.value;
    const desc = descriptionRef.current.value;
    const cost = costRef.current.value;
    const stock = stockRef.current.value;
    const updatedBy = state.user.name;
    const updatedOn = new Date().toLocaleDateString();
    const createdUserId = state.user._id;

    console.log(updatedBy, updatedOn);

    await axios.post(
      `${BackendUrl}/add-product`,
      {
        productName: product,
        productImage: imgUri,
        description: desc,
        cost,
        stock,
        updatedBy,
        updatedOn,
        createdUserId,
      },
      { withCredentials: true }
    );
    productRef.current.value = "";
    descriptionRef.current.value = "";
    costRef.current.value = "";
    stockRef.current.value = "";
    setImgUri("");
    toast.success("Product added successfully!");
    dispatch({
      type: "REFRESH_PRODUCTS",
      payload: true,
    });
  };

  return (
    <>
      <Transition in={true} timeout={500} mountOnEnter unmountOnExit>
        <Form>
          <Form.Group md="6" className="mb-3">
            <Form.Control
              required
              autoFocus
              ref={productRef}
              type="text"
              placeholder="Product Name"
            />
          </Form.Group>
          <Form.Group md="6" className="mb-3">
            <FloatingLabel
              controlId="floatingTextarea"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="Leave a comment here"
                ref={descriptionRef}
                required
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group md="6" className="mb-3">
            <Form.Control
              required
              autoFocus
              ref={costRef}
              type="number"
              placeholder="Cost"
            />
          </Form.Group>
          <Form.Group md="6" className="mb-3">
            <Form.Control
              required
              autoFocus
              ref={stockRef}
              type="number"
              placeholder="Stock"
              aria-required="true"
            />
          </Form.Group>
          <Form.Group md="6" className="mb-3">
            <Form.Label>Image: </Form.Label> <br />
            <div className="input-file-container">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={addImageHandler}
                aria-required="true"
                name="imgCollection"
              />
            </div>
          </Form.Group>
          <Form.Group md="6" className="mb-3">
            <Button variant="success" onClick={addProductHandler}>
              Add Product
            </Button>
          </Form.Group>
        </Form>
      </Transition>
    </>
  );
}
