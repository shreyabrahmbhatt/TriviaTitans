import React, { useState, useEffect } from "react";
import {
  Form,
  Tab,
  Tabs,
  Container,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import axios from "axios";
import Table from "../components/Table";
import "../styles/leaderboard.css";
import Chart from "../components/Chart";
import AuthDetails from "../components/AuthDetails";

export default function LeaderboardPage() {
  const { authUser, userSignOut } = AuthDetails();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [timeFrame, setTimeFrame] = useState("all-time");
  const [category, setCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("0");

  useEffect(() => {
    fetchLeaderboardData();
  }, [timeFrame, category, activeTab]);

  const fetchLeaderboardData = async () => {
    try {
      let url = `https://c3jaznelxapc5wwvr72rrcfycu0dduex.lambda-url.us-east-1.on.aws/?entityType=${
        activeTab === "0" ? "team" : "player"
      }&timeFrame=${timeFrame}`;

      // Add category to the URL only if it's not "all"
      if (category !== "all") {
        url += `&category=${category}`;
      }

      const resp = await axios.get(url);
      const fetchedData = resp.data;
      setLeaderboardData(fetchedData);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

  // Define the columns for the leaderboard table
  const columns = React.useMemo(
    () => [
      { Header: "Name", accessor: "name" },
      { Header: "Efficiency", accessor: "efficiency" },
      { Header: "Right Answer", accessor: "total_right_answers" },
      { Header: "Wrong Answer", accessor: "total_wrong_answers" },
      { Header: "Score", accessor: "total_score" },
    ],
    []
  );

  const handleTabChange = (eventKey) => {
    setActiveTab(eventKey);
  };

  const timeFrameOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "all-time", label: "All Time" },
  ];

  const categoryOptions = [
    { value: "all", label: "All" },
    { value: "1", label: "GK" },
    { value: "2", label: "Sports" },
    { value: "3", label: "Games" },
  ];

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
                <Nav.Link onClick={userSignOut} href="/login">
                  Logout
                </Nav.Link>
              </Nav>
            </Container>
          </Navbar>
          <Container className="container">
            <h4 className="heading" align="center">
              Leaderboard
            </h4>
            <Tabs activeKey={activeTab} onSelect={handleTabChange}>
              <Tab eventKey={0} title="Teams" />
              <Tab eventKey={1} title="Individual Players" />
            </Tabs>
            <div className="filters">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categoryOptions.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Time Frame</Form.Label>
                  <Form.Select
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value)}
                  >
                    {timeFrameOptions.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Form>
            </div>
            <Table columns={columns} data={leaderboardData} />
            <div className="statistics">
              <h5 align="center">Statistics</h5>
              <Chart data={leaderboardData} />
            </div>
          </Container>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
