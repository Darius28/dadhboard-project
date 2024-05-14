import React, { useContext, useRef, useState } from "react";
import { Context } from "../../../context";
import {
  Form,
  Button,
  Row,
  Col,
  InputGroup,
  DropdownButton,
  Dropdown,
  FloatingLabel,
} from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { BackendUrl } from "../../../utils/BackendUrl";

export default function Signup() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const cpasswordRef = useRef();
  const addressRef = useRef();
  const [accType, setAccType] = useState();
  const [validated, setValidated] = useState(false);
  const [showAddress, setShowAddesss] = useState(false);
  const { dispatch } = useContext(Context);
  const navToLoginHandler = () => {
    dispatch({
      type: "MODAL_STATUS",
    });
    dispatch({
      type: "MODAL_STATUS",
      payload: "login",
    });
  };

  const signupHandler = async (e) => {
    console.log("entered signup handler");
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);
    try {
      console.log("enteed try block of console handler");
      const name = nameRef.current.value;
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      const cpassword = cpasswordRef.current.value;
      var address;
      if (accType === "vendor") {
        address = addressRef.current.value;
      } else {
        address = "";
      }

      console.log(accType);

      if (password !== cpassword) {
        toast.error("Passwords don't match.");
        return;
      }
      const { data } = await axios.post(`${BackendUrl}/signup`, {
        name,
        email,
        password,
        accountType: accType,
        address,
      });
      if (data.ok) {
        toast.success("Signup successful. Login to proceed");
      }
    } catch (err) {
      console.log("enteed catch block of console handler");
      console.log(err);
      toast.error(err.response.data);
    }
  };

  const handleSelect = (e) => {
    console.log(e.target.value);
    setAccType(e.target.value);
    if (e.target.value === "vendor") {
      setShowAddesss(true);
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={signupHandler}>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom01">
          <Form.Label>Name</Form.Label>
          <Form.Control
            autoFocus
            required
            ref={nameRef}
            type="text"
            placeholder="Name"
          />
          <Form.Control.Feedback type="invalid">
            Please enter your name.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="validationCustom02">
          <Form.Label>Email</Form.Label>
          <Form.Control
            required
            ref={emailRef}
            type="email"
            placeholder="Email"
          />
          <Form.Control.Feedback type="invalid">
            Please enter your email.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom03">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            ref={passwordRef}
            placeholder="Password"
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a password.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="validationCustom03">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            ref={cpasswordRef}
            type="password"
            placeholder="Confirm Password"
            required
          />
          <Form.Control.Feedback type="invalid">
            Please confirm password.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <select
          style={{ padding: "12px", margin: "12px" }}
          className="form-select"
          onChange={handleSelect}
          placeholder="Select Account Type"
          required
        >
          <option selected>Select Account type</option>
          <option value="vendor">Vendor</option>
          <option value="user">User</option>
          <option value="delivery">Delivery</option>
        </select>
      </Row>
      {showAddress && (
        <>
          <Row>
            <Form.Group as={Col} md="6" controlId="validationCustom01">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Address"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Address"
                  ref={addressRef}
                />
              </FloatingLabel>
            </Form.Group>
          </Row>

          <br />
        </>
      )}

      <div className="center mb-3">
        <Button type="submit">Sign Up</Button>
      </div>
      <div className="center">
        <p>
          Already a registered user?{" "}
          <span className="navigation-link" onClick={navToLoginHandler}>
            Login
          </span>
        </p>
      </div>
    </Form>
  );
}
