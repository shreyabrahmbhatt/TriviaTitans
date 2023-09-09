import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { Nav, Navbar, NavDropdown, Container } from "react-bootstrap";
import AuthDetails from "./AuthDetails";
import axios from "axios";
import {Button} from "react-bootstrap";
import viewinviteImg from "../assets/viewInviteImage.svg";
import { useNavigate } from "react-router-dom/dist";

const ViewInvite = () => {
  const { authUser, userSignOut } = AuthDetails();
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteTeam, setInviteTeam] = useState("");
  const [inviteTeamID, setInviteTeamID] = useState("");
  const [invite, setInvite] = useState();
  const [receiptHandle, setReceiptHandle] = useState("");
  const [noInvite, setNoInvite] = useState(true);
  const navigate = useNavigate();

  const getNotification = "https://t2tmfwwqpv525c4adofxfd2rwa0ldjvm.lambda-url.us-east-1.on.aws/";
  const deleteMessage = "https://wofc3rccps5yyak7qns7nwvrza0ndtey.lambda-url.us-east-1.on.aws/";
  const updateAPI = "https://hlm56ce3psne2wiah3cvtfl2ei0xhbli.lambda-url.us-east-1.on.aws/";
  const userUpdateAPI = "https://nbs76ibfdx6iks3d3xojulkaxy0udjaq.lambda-url.us-east-1.on.aws/";

  useEffect(() => {
    const getData = async () => {
        try{
        const response = await axios.get(getNotification);
        console.log(response.data);
        response.data.forEach(msg => {
            console.log(JSON.parse(msg.Body).MessageAttributes.email['Value']);
            console.log(JSON.parse(msg.Body).MessageAttributes.team_name['Value']);
            console.log(JSON.parse(msg.Body).Message);
            console.log(msg.ReceiptHandle);
            if( authUser && authUser.email === JSON.parse(msg.Body).MessageAttributes.email['Value']){
                console.log("yes")
                setNoInvite(false);
                setInvite(msg.Body);
                setInviteMessage(JSON.parse(msg.Body).Message);
                setInviteEmail(JSON.parse(msg.Body).MessageAttributes.email['Value']);
                setInviteTeam(JSON.parse(msg.Body).MessageAttributes.team_name['Value']);
                setInviteTeamID(JSON.parse(msg.Body).MessageAttributes.team_id['Value']);
                setReceiptHandle(msg.ReceiptHandle);    
            }
        });
    }
    catch(error){
        console.log(error);
    }

    }

    getData(); 

  }, [authUser])
  
  const handleAccept = (event) => {
    //event.preventDefault();
    axios.post(deleteMessage, {receiptHandle: receiptHandle })
        .then((response) => {
            console.log(response.data);
            updateTeam(inviteTeamID);
            updateUser(inviteTeamID,inviteTeam);
            navigate("/viewinvite");
        })
        .catch((error) => {
            console.log(error);
        })
  }

  const handleDecline = (event) => {
    event.preventDefault();
    axios.post(deleteMessage, {receiptHandle: receiptHandle })
        .then((response) => {
            console.log(response.data);
            navigate("/viewinvite");
        })
        .catch((error) => {
            console.log(error);
        })
  }

  const updateTeam = (ID) => {
    const mail = authUser.email
    console.log(mail)
    const body = {
      "team_id": parseInt(ID, 10),
      "new_user": authUser.email,
      "role_update": { [mail]: "Member"}
    }
  
    console.log(body);
  
    axios.post(updateAPI,body)
    .then((response) =>{
      console.log(response.data);
      })
      .catch((error) => {console.log(error);})
    
  }
  
  const updateUser = (ID,teamName) => {
    console.log(authUser);
    console.log(authUser.uid);
    const body = {
      "team_id": parseInt(ID, 10),
      "team_name": teamName,
      "uid": authUser.uid
    
    }
  
    console.log(body);
  
    axios.post(userUpdateAPI,body)
    .then((response) =>{
      console.log(response.data);
      })
      .catch((error) => {console.log(error);})
    
  }

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

    
    <br/>
    {noInvite && <p>No invites to show !!</p>}
    { invite && (<div>  {inviteMessage && <p>Invite Message: {inviteMessage}</p>}
                        {inviteEmail && <p>Invite Email: {inviteEmail}</p>}  
                        {inviteTeam && <p>Team: {inviteTeam}</p>}
                        {inviteTeamID && <p>Team ID: {inviteTeamID}</p>}
                      </div>              
    )}
    {invite ? (
        <>
        <Button style={{marginRight: "5px"}}variant="outline-success" onClick={handleAccept}>
          Accept
        </Button>
        <Button variant="outline-danger" onClick={handleDecline}>
          Decline
        </Button>
        </>
      ) : (
        <></>
      )}
        <img src={viewinviteImg} style={{ position: 'absolute', bottom: '5px',  right: '100px', width: '300px', height: '300px' }}></img>
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
      <img src={viewinviteImg} style={{ position: 'absolute', bottom: '5px',  right: '100px', width: '300px', height: '300px' }}></img>
    </>
  );
};

export default ViewInvite;
