import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { Nav, Navbar, NavDropdown, Container } from "react-bootstrap";
import AuthDetails from "./AuthDetails";
import axios from "axios";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Statisctics = () => {
  const { authUser, userSignOut } = AuthDetails();
  const [teamName, setTeamName] = useState("");
  const [teamID, setTeamID] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [teamRole, setTeamRole] = useState("");
  const [teamInfo, setTeamInfo] = useState("");
  const [noTeam, setNoTeam] = useState(true);

  const getUser =
    "https://ty5uk6v4k3wpsy6rarv56cpduy0hrnbj.lambda-url.us-east-1.on.aws/";
  const getTeam =
    "https://v3zawbbk6hy6azikv7uxoim4qy0wmkku.lambda-url.us-east-1.on.aws/";

  useEffect(() => {
    const getData = async () => {
      try {
        console.log(authUser.uid);
        const response = await axios.post(getUser, { id: authUser.uid });
        console.log(JSON.parse(response.data.body))
        console.log(JSON.parse(response.data.body).Items[0].team_id);
        console.log(JSON.parse(response.data.body).Items[0].team_name);
        setTeamID(JSON.parse(response.data.body).Items[0].team_id);
        setTeamName(JSON.parse(response.data.body).Items[0].team_name);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [authUser]);

  useEffect(() => {
    const getTeamData = async () => {
      try {
        const mail = authUser.email;
        const res = await axios.post(getTeam, { id: teamID });
        console.log("Team Details")
        console.log(JSON.parse(res.data.body).Items[0]);
        console.log(JSON.parse(res.data.body).Items[0].team_roles);
        setTeamInfo(JSON.parse(res.data.body).Items[0]);
        console.log(teamInfo.game_id)
        setTeamRole(JSON.parse(res.data.body).Items[0].team_roles[mail]);
        setTeamMembers(JSON.parse(res.data.body).Items[0].team_members);
      } catch (error) {
        console.log(error);
      }
    };
    getTeamData();
  }, [teamID]);

  



  return (
    <>
      {authUser ? (
        <>
          <Navbar bg="dark" data-bs-theme="dark">
            <Container>
              <Navbar.Brand href="/">Trivia Fun</Navbar.Brand>
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/statistics">Statistics</Nav.Link>
                <Nav.Link href="/profile">Profile</Nav.Link>
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
                <Nav.Link href="/gameLobby">Game Lobby</Nav.Link>
              </Nav>
              <Nav>
                <Navbar.Text>Hello, {authUser.email}</Navbar.Text>
                <Nav.Link onClick={userSignOut} href="/login">
                  Logout
                </Nav.Link>
              </Nav>
            </Container>
          </Navbar>

          <br />
          <div
            style={{ textAlign: "left", marginTop: "20px", marginLeft: "20px" }}
          >
            {!teamID && <h2 style={{textAlign: "center"}}>You don't have any team association !!</h2>}
            {teamID && <>{teamName && <p>Team Name: {teamName}</p>}</>}
            {teamID && <>{teamID && <p>Team ID: {teamID}</p>}</>}
            
            <br />
            {teamID && <>{teamID && <h2>Team Statistics Table:</h2>}</>}
            
            {teamID && (
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Right Answers</th>
                    <th>Wrong Answers</th>
                    <th>Win/loss Ratio</th>
                    <th>Total points earned</th>
                  </tr>
                </thead>
                <tbody>
                    <tr>
                  {teamID && teamInfo && (
                    <>
                      <td>{teamInfo.right_answers}</td>
                      <td>{teamInfo.wrong_answers}</td>
                      <td>{parseFloat(teamInfo.right_answers)*100/(parseFloat(teamInfo.right_answers)+parseFloat(teamInfo.wrong_answers))}%</td>
                      <td>{teamInfo.Score}</td>
                    </>
                  )}
                  </tr>
                </tbody>
              </Table>
            )}
          </div>
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
        </>
      )}
    </>
  );
};

export default Statisctics;
