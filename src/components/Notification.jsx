import React, { useState, useEffect } from "react";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  ListGroup,
} from "react-bootstrap";
import axios from "axios";
import AuthDetails from "../components/AuthDetails";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../styles/notification.css";

export default function Notification() {
  const { authUser, userSignOut } = AuthDetails();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");

  useEffect(() => {
    if (authUser) {
      setId(authUser.uid);
    }
  }, [authUser]);

  console.log(id);

  useEffect(() => {
    if (id) {
      fetchNotifications();
    }
  }, [id]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `https://3aw2wy77xrs2irrcyza4zde5jq0xpsnk.lambda-url.us-east-1.on.aws/?id=${id}`
      );
      setNotifications(response.data.notifications);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
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
              <Nav>
                <Navbar.Text>Hello, {authUser.email}</Navbar.Text>
                {/* <Navbar.Text>Hello, {authUser.email}</Navbar.Text> */}
                <Nav.Link onClick={userSignOut} href="/login">
                  Logout
                </Nav.Link>
              </Nav>
            </Container>
          </Navbar>
          <Container className="container">
            <h2>Notifications</h2>
            {loading ? (
              <div>
                <Skeleton count={10} />
              </div>
            ) : (
              <ListGroup className="notification-container">
                {notifications.map((notification, index) => (
                  <ListGroup.Item key={index} className="notification-item">
                    {notification}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Container>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
