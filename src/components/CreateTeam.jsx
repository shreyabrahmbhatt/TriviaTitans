import React, {useState} from 'react';
import { Nav, Navbar, NavDropdown, Container, Button } from "react-bootstrap";
import axios from "axios";
import AuthDetails from "./AuthDetails";
import { useNavigate } from 'react-router-dom';
import teamImg from "../assets/createTeam.svg";

function CreateTeam() {
  const { authUser, userSignOut } = AuthDetails();
  const [teamName, setTeamName] = useState("");
  const [teamID, setTeamID] = useState("");
  const navigate = useNavigate();

  const storeTeam = "https://m5n6ywlwvffmndjvmmozxuoflu0iqqfh.lambda-url.us-east-1.on.aws/";
  const updateAPI = "https://hlm56ce3psne2wiah3cvtfl2ei0xhbli.lambda-url.us-east-1.on.aws/";
  const userUpdateAPI = "https://nbs76ibfdx6iks3d3xojulkaxy0udjaq.lambda-url.us-east-1.on.aws/";

  const handleB = (event) => {
    event.preventDefault();
    let req = {
      "model": "gpt-3.5-turbo",
      "messages": [{"role": "user", "content": "Generate a one word cool team name for a trivia game that is never generated before and in response just give the name"}],
      "temperature": 0.7
 };
    axios.post('https://api.openai.com/v1/chat/completions', req , 
      { 
        headers: { 
          Authorization: 'Bearer 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',
          'Content-Type': 'application/json'
        } 
      })
  .then(response => {
    // Handle the successful response
    console.log(response.data.choices[0].message.content);
    setTeamName(response.data.choices[0].message.content);

  })
  .catch(error => {
    // Handle the error
    console.error(error);
  });

}

const createTeam = (event) => {
  event.preventDefault();
  const body = {
    "team_id": Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000,
    "team_name": teamName,
    "team_members": [],
    "team_roles": {},
    "Score": 0,
    "game_id": "",
    "right_answers": 0,
    "wrong_answers": 0
  }

  console.log(body);
  
  axios.post(storeTeam,body)
  .then((response) =>{
    console.log(response.data)
      console.log(response.data.Item.team_id);
      setTeamID(response.data.Item.team_id);
      updateTeam(response.data.Item.team_id);
      updateUser(response.data.Item.team_id);
      navigate("/");
    })
    .catch((error) => {console.log(error);})

}

const updateTeam = (ID) => {
  const mail = authUser.email
  console.log(mail)
  const body = {
    "team_id": ID,
    "new_user": authUser.email,
    "role_update": { [mail]: "Admin"}
  }

  console.log(body);

  axios.post(updateAPI,body)
  .then((response) =>{
    console.log(response.data);
    })
    .catch((error) => {console.log(error);})
  
}

const updateUser = (ID) => {
  console.log(authUser);
  console.log(authUser.uid);
  const body = {
    "team_id": ID,
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
              <Nav  className="me-auto">
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
        <div style={{textAlign: "left", marginLeft: "40px" , marginTop:"40px"}} className="App">
        <h2 style={{marginTop: "20px", marginBottom: "15px"}}>Create a team</h2>
        {!teamName && <Button  onClick={handleB}
                style={{marginTop: "20px", marginBottom: "15px"}}
                variant="outline-primary"
              >
                Genereate a team name!
      </Button>}
      {teamName && <p>Team created: {teamName}</p>}
      {teamName && <Button onClick={createTeam}
                style={{ margin: "20px" }}
                variant="outline-primary"
              >
                Create Team
      </Button>}
    </div>
    <img src={teamImg} style={{ position: 'absolute', bottom: '5px',  right: '100px', width: '400px', height: '400px' }}></img>
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
      <img src={teamImg} style={{ position: 'absolute', bottom: '5px',  right: '100px', width: '400px', height: '400px' }}></img>
    </>
    
  );
}

export default CreateTeam;