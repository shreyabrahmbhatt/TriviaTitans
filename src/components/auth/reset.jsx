import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { Nav , Navbar , Container  ,Button} from "react-bootstrap";
import resetImg from "../../assets/resetImg.svg";

const Reset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");


  const resetPassword = (e) => {
    e.preventDefault();
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
    .then(() => {
        console.log(email);
        setMessage("Reset password mail sent successfully");
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
    });
  };

  return (<>
    <Navbar bg="dark" data-bs-theme="dark">
            <Container>
              <Navbar.Brand href="/">Trivia Fun</Navbar.Brand>
              <Nav>
                <Nav.Link  href="/signup">Signup</Nav.Link>
                <Nav.Link  href="/login">Login</Nav.Link>
              </Nav>
            </Container>
        </Navbar>
    <div style={{textAlign: "left", marginLeft: "40px" , marginTop:"40px"}} className="sign-in-container">
      <form onSubmit={resetPassword}>
        <h2>Reset Password</h2>
        Email address <br/><input
          type="email"
          placeholder="Enter your email"
          value={email}
          style={{ margin:"5px" , width: "400px"}}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <br/>
        <br/>
        <div>
        <Button variant="dark" onClick={resetPassword}>Send Reset Password Link</Button>
        </div>
        { message && <p style={{color: "green"}}>{message}</p>}
      </form>
    </div>
    <img src={resetImg} style={{ position: 'absolute', bottom: '50px',  right: '50px', width: '400px', height: '400px' }}></img>
    </>
  );
};

export default Reset;