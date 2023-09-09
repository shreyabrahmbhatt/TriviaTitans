import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { Nav, Navbar, NavDropdown, Container, Button } from "react-bootstrap";
import { FiBell } from "react-icons/fi";
import AuthDetails from "./AuthDetails";
import cloudimg from "../assets/landingImage.svg";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const { authUser, userSignOut } = AuthDetails();
  const navigate = useNavigate();
  const handleBellClick = () => {
    navigate("/notification");
  };

  return (
    <>
      {authUser ? (
        <>
          <Navbar bg="dark" data-bs-theme="dark">
            <Container>
              <Navbar.Brand href="/">Trivia Fun</Navbar.Brand>
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/statistics">Statisctics</Nav.Link>
                <Nav.Link href="/profile">Profile</Nav.Link>
                <Nav.Link href="/leaderboard">Leaderboard</Nav.Link>
                <NavDropdown title="Teams" id="navbarScrollingDropdown">
                  <NavDropdown.Item href="/create">
                    Create team
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/view">View Team</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/invite">
                    Invite a member
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/viewinvite">
                    View Invitations
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <FiBell
                size={17}
                style={{ cursor: "pointer", marginRight: "1rem" }}
                onClick={handleBellClick}
                color="white"
              />
              <Nav>
                <Navbar.Text>Hello, {authUser.email}</Navbar.Text>
                <Nav.Link onClick={userSignOut} href="/login">
                  Logout
                </Nav.Link>
              </Nav>
            </Container>
          </Navbar>
          <div
            style={{ textAlign: "left", marginLeft: "40px", marginTop: "40px" }}
          >
            <h2>Serverless Trivia Game</h2>
            <p>Welcome to our Serverless trivia game developed by SDP5 Team.</p>
            <p>We have named our game Trivia Fun.</p>
            <Button
              variant="outline-primary"
              style={{ marginRight: "15px" }}
              onClick={() => navigate("/profile")}
            >
              View Profile
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => navigate("/profile")}
            >
              View Statistics
            </Button>
          </div>

          <img
            src={cloudimg}
            style={{
              position: "absolute",
              bottom: "50px",
              right: "50px",
              width: "400px",
              height: "400px",
            }}
          ></img>
        </>
      ) : (
        <>
          <Navbar bg="dark" data-bs-theme="dark">
            <Container>
              <Navbar.Brand href="/">Trivia Fun</Navbar.Brand>
              <Nav>
                <Nav.Link onClick={userSignOut} href="/signup">
                  Signup
                </Nav.Link>
                <Nav.Link onClick={userSignOut} href="/login">
                  Login
                </Nav.Link>
              </Nav>
            </Container>
          </Navbar>
          <div
            style={{ textAlign: "left", marginLeft: "40px", marginTop: "40px" }}
          >
            <h2>Serverless Trivia Game</h2>
            <p>Welcome to our Serverless trivia game developed by SDP5 Team.</p>
            <p>We have named our game Trivia Fun.</p>
            <Button
              variant="outline-primary"
              style={{ marginRight: "15px" }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </div>

          <img
            src={cloudimg}
            style={{
              position: "absolute",
              bottom: "50px",
              right: "50px",
              width: "400px",
              height: "400px",
            }}
          ></img>
        </>
      )}
    </>
  );
};

export default LandingPage;
