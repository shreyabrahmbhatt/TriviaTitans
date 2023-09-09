import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { Nav, Navbar, NavDropdown, Container } from "react-bootstrap";
import AuthDetails from "./AuthDetails";
import axios from "axios";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ViewTeam = () => {
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
  const leaveTeam =
    "https://6bmkds6baf663mwzx6rzkijghe0yrbdj.lambda-url.us-east-1.on.aws/";
  const leaveTeamUser =
    "https://5ulxa2y7je7etz2lm2l5fjyg6u0bddvr.lambda-url.us-east-1.on.aws/";
  const promoteUser =
    "https://vedsnpw45wxooffhv6cr2iwwb40mptda.lambda-url.us-east-1.on.aws/";
  const removeUser =
    "https://mgqag2vl4mvdywvvg3ugtsolbq0kfrdn.lambda-url.us-east-1.on.aws/";

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
        setTeamRole(JSON.parse(res.data.body).Items[0].team_roles[mail]);
        setTeamMembers(JSON.parse(res.data.body).Items[0].team_members);
      } catch (error) {
        console.log(error);
      }
    };
    getTeamData();
  }, [teamID]);

  const handleLeaveTeam = (event) => {
    event.preventDefault();
    const mail = authUser.email;
    console.log(mail);
    const body = {
      team_id: teamID,
      delete_user: authUser.email,
    };

    console.log(body);

    axios
      .post(leaveTeam, body)
      .then((response) => {
        console.log(response.data);
        handleLeaveUser();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLeaveUser = () => {
    console.log(authUser);
    console.log(authUser.uid);
    const body = {
      team_id: "",
      team_name: "",
      uid: authUser.uid,
    };

    console.log(body);

    axios
      .post(leaveTeamUser, body)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePromote = (member) => {
    //event.preventDefault();
    const mail = member;
    console.log(mail);
    const body = {
      team_id: teamID,
      promote_user: member,
    };

    console.log(body);

    axios
      .post(promoteUser, body)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRemoveTeam = (member) => {
    const mail = member;
    console.log(mail);
    const body = {
      team_id: teamID,
      delete_user: member,
    };

    console.log(body);

    axios
      .post(leaveTeam, body)
      .then((response) => {
        console.log(response.data);
        handleRemoveUser(member);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRemoveUser = (member) => {
    console.log(member);
    const body = {
      team_id: "",
      team_name: "",
      user_email: member,
    };

    console.log(body);

    axios
      .post(removeUser, body)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
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
            {teamID && (
              <Button variant="outline-danger" onClick={handleLeaveTeam}>
                Leave Team
              </Button>
            )}
            <br />
            <br />
            {teamID && (
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Team member email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {teamID && teamMembers && (
                    <>
                      {teamMembers.map((member, index) => (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{member}</td>
                          <td>{teamInfo.team_roles[member]}</td>
                          <td>
                            {teamInfo.team_roles[authUser.email] === "Admin" ? (
                              <>
                                <Button
                                  variant="outline-success"
                                  onClick={() => handlePromote(member)}
                                >
                                  Promote
                                </Button>{" "}
                                <Button
                                  variant="outline-danger"
                                  onClick={() => handleRemoveTeam(member)}
                                >
                                  Remove
                                </Button>
                              </>
                            ) : (
                              <>You are not an Admin</>
                            )}
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
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

export default ViewTeam;
