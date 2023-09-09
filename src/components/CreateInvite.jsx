import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { Nav, Navbar, NavDropdown, Container, Button } from "react-bootstrap";
import AuthDetails from "./AuthDetails";
import axios from "axios";
import inviteImg from "../assets/inviteImage.svg";

const CreateInvite = () => {
  const { authUser, userSignOut } = AuthDetails();
  const [email, setEmail] = useState('');
  const [Message, setMessage] = useState('');
  const [invitationSuccess, setInvitationSuccess] = useState("");
  const [teamID,setTeamID] = useState("");
  const [teamName,setTeamName] = useState("");

  const getAPI = "https://ty5uk6v4k3wpsy6rarv56cpduy0hrnbj.lambda-url.us-east-1.on.aws/";

  useEffect(() => {
    const getData = async () => {
      try{
        console.log(window.sessionStorage.getItem("user_id"));
        const response = await axios.post(getAPI, {"id": window.sessionStorage.getItem("user_id")});
        console.log(JSON.parse(response.data.body));
        console.log(JSON.parse(response.data.body).Items[0].team_id);
        setTeamID(JSON.parse(response.data.body).Items[0].team_id);
        setTeamName(JSON.parse(response.data.body).Items[0].team_name);
        
    }
    catch(error){
      console.log(error);
  }
  }
    getData(); 

  }, [])
  
  const sendInvitation = async () => {
    try {
      const req = {
        "email": email,
        "team_id": teamID,
        "team_name": teamName,
        "message": Message
      }

      console.log(req);
      const response = await axios.post('https://xbutbrxhmxzp6b6yoig3m4agte0bsltz.lambda-url.us-east-1.on.aws/', req);

      console.log('Invitation sent:', response.data);
      setInvitationSuccess("Invite sent successfully !!");
    } catch (error) {
      console.error('Failed to send invitation:', error);
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
                <NavDropdown.Item href="/create">Create team</NavDropdown.Item>
                <NavDropdown.Item href="/view">
                  View Team
                </NavDropdown.Item>
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
                <Nav.Link onClick={userSignOut} href="/login">Logout</Nav.Link>
              </Nav>
            </Container>
        </Navbar>

        <div style={{textAlign: "left", marginLeft: "40px" , marginTop:"40px"}}>
          <h2 style={{marginTop: "20px", marginBottom: "15px"}}>Invite a user</h2>
          Invite message <br/><input
        style={{ marginTop:"5px" , marginBottom: "15px" , width: "500px"}}
        type="text"
        placeholder="Enter your message"
        value={Message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <br/>
      Invite email <br/><input
        style={{ marginTop:"5px" , marginBottom: "5px" , width: "500px"}}
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br/><br/>
      <Button onClick={sendInvitation} variant="primary">Send invitation</Button>
    </div>
    <br/>
    { invitationSuccess && <h5 style={{marginLeft: "40px" , color: "green" ,textAlign: "left"}}>{invitationSuccess}</h5>}
    <img src={inviteImg} style={{ position: 'absolute', bottom: '5px',  right: '100px', width: '400px', height: '400px' }}></img>
        </>
      ) : (
        <>
          <Navbar bg="dark" data-bs-theme="dark">
            <Container>
              <Navbar.Brand href="/">Trivia Fun</Navbar.Brand>
              <Nav>
                <Nav.Link onClick={userSignOut} href="/signup">Signup</Nav.Link>
                <Nav.Link onClick={userSignOut} href="/login">Login</Nav.Link>
              </Nav>
            </Container>
        </Navbar>
        </>
      )}
      <img src={inviteImg} style={{ position: 'absolute', bottom: '5px',  right: '100px', width: '400px', height: '400px' }}></img>
    </>
  );
};

export default CreateInvite;