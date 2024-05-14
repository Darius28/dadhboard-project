import React, { useContext, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { Context } from "../../../context";
import { Transition } from "react-transition-group";
import { toast } from "react-toastify";
import axios from "axios";
import { BackendUrl } from "../../../utils/BackendUrl";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();

  const {
    state,
    state: { showModal },
    dispatch,
  } = useContext(Context);

  const navToSignupHandler = () => {
    dispatch({
      type: "MODAL_STATUS",
    });
    dispatch({
      type: "MODAL_STATUS",
      payload: "signup",
    });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      const { data } = await axios.post(
        `${BackendUrl}/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      dispatch({
        type: "MODAL_STATUS",
      });
      dispatch({
        type: "LOGIN",
        payload: data.user,
      });
      if (email === "admin@admin.com") {
      }
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Welcome!");
    } catch (err) {
      console.log(err);
      toast.error(err.response.data);
    }
  };

  return (
    <>
      <Transition in={true} timeout={500} mountOnEnter unmountOnExit>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              required
              autoFocus
              ref={emailRef}
              type="email"
              placeholder="Email Address"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              required
              type="password"
              ref={passwordRef}
              placeholder="Password"
            />
          </Form.Group>

          <div className="center">
            <p>
              New User?{" "}
              <span className="navigation-link" onClick={navToSignupHandler}>
                Signup
              </span>
            </p>
          </div>
          <div className="center">
            <Button variant="primary" type="submit" onClick={loginHandler}>
              Login
            </Button>
          </div>
        </Form>
      </Transition>
    </>
  );
}
