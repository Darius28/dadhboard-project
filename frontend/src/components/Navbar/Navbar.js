import React, { useContext } from "react";
import { Navbar, Nav, Container, Image, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Context } from "../../context";
import { useNavigate } from "react-router";
import axios from "axios";
import { BackendUrl } from "../../utils/BackendUrl";
import { toast } from "react-toastify";
import UserModal from "../UserModal/UserModal";

const HeaderBar = () => {
  const { state, dispatch } = useContext(Context);
  const { user, showModal, isAdmin } = state;
  const navigate = useNavigate();

  console.log("navbar user: ", user);
  const showLoginModalHandler = () => {
    dispatch({
      type: "MODAL_STATUS",
      payload: "login",
    });
  };

  const showSignupModalHandler = () => {
    dispatch({
      type: "MODAL_STATUS",
      payload: "signup",
    });
  };

  const logoutHandler = async () => {
    try {
      const LS = JSON.parse(localStorage.getItem("user"));
      const userId = LS._id;
      dispatch({
        type: "LOGOUT",
      });
      dispatch({
        type: "IS_ADMIN",
        type: false,
      });
      localStorage.removeItem("user");
      const { data } = await axios.post(
        `${BackendUrl}/logout`,
        {
          userId,
        },
        { withCredentials: true }
      );
      navigate("/");
      toast.success("Logout Successful.");
    } catch (err) {
      console.log(err);
      toast(err.response.data);
    }
  };

  return (
    <>
      <Navbar className="header-nav" data-bs-theme="dark">
        <Container className="header-nav-container">
          <div>
            <Navbar.Brand href="#home">
              <Image alt="logo" src="./logo.jpg" />
            </Navbar.Brand>
          </div>
          <div>
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              {user ? (
                <>
                  <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                  {user.email === "admin@admin.com" ? (
                    <>
                      <Nav.Link href="/dashboard">Add Vendor</Nav.Link>
                      <Nav.Link href="/dashboard">Add Delivery</Nav.Link>
                    </>
                  ) : (
                    <></>
                  )}
                  <Button variant="outline-light" onClick={logoutHandler}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline-light"
                    onClick={showLoginModalHandler}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline-light"
                    onClick={showSignupModalHandler}
                  >
                    Signup
                  </Button>
                </>
              )}
            </Nav>
          </div>
        </Container>
      </Navbar>
      {showModal && <UserModal />}
    </>
  );
};

export default HeaderBar;
