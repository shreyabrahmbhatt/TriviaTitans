import { createUserWithEmailAndPassword , GoogleAuthProvider , FacebookAuthProvider , signInWithPopup , signOut} from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { Button , Navbar , Container, Nav} from "react-bootstrap";
import signupimg from "../../assets/signUpImage.svg";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpass , setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const signUp = (e) => {
    e.preventDefault();
    if(password != confirmpass){
      setError("Password and Confirm password doesn't match  !");
      return
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        window.sessionStorage.setItem("user_id", userCredential.user.uid);
        window.sessionStorage.setItem("user_email", userCredential.user.email);
        console.log(userCredential.user.uid);
        console.log(userCredential.user.email);
        signOut(auth);
        navigate("/authentication");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        if(error.code ==="auth/weak-password")
        {
          setError("Password is weak. Please make it stronger !");
          console.log(error.code);
        }
      });
  };

  const providerGoogle = new GoogleAuthProvider();
  const signInWithGoogle = (e) => {
    e.preventDefault();
    signInWithPopup(auth, providerGoogle)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
    console.log(result);
    console.log(result.user.email);
    navigate("/authentication");
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
    console.log(error);
    console.log(error.code);
    console.log(error.message);
    console.log(error.customData.email)
  });
    
  };

  const providerFacebook = new FacebookAuthProvider();
  const signInWithFacebook = (e) => {
    e.preventDefault();
    signInWithPopup(auth, providerFacebook)
  .then((result) => {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
    console.log(result);
    console.log(result.user.email);
    navigate("/authentication");
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);
    // ...
    console.log(error);
    console.log(error.code);
    console.log(error.message);
    console.log(error.customData.email)
  });
    
  };

  return (
    <>
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
      <form onSubmit={signUp}>
        <h2>Create  a new Account</h2>
        Email address <br/><input
          type="email"
          placeholder="Enter your email"
          value={email}
          style={{ margin:"5px" , width: "400px"}}
          onChange={(e) => setEmail(e.target.value)}
          required
        ></input><br/>
        Password <br/> <input
          type="password"
          placeholder="Enter your password"
          value={password}
          style={{ margin:"5px" , width: "400px"}}
          onChange={(e) => setPassword(e.target.value)}
          required
        ></input><br/>
        Confirm Password <br/> <input
          type="password"
          placeholder="Please Confirm the password"
          value={confirmpass}
          style={{ margin:"5px" , width: "400px"}}
          onChange={(e) => setConfirmPass(e.target.value)}
          required
        ></input>
        <br/>
        <br/>
        <Button variant="primary" type="submit">
          Sign Up
        </Button>
        <br/>
        <br/>
        { error && (<><h5 style={{color: "red"}}>{error}</h5><br/></>)}
        <div style={{display: "inline-block" , marginRight: "10px"}}>
        <button className="button-style" onClick={signInWithGoogle}>
          <span className="google-logo"></span>
          Sign in with Google
        </button>
        </div>
        <div style={{display: "inline-block"}}>
        <button className="button-style" onClick={signInWithFacebook}>
          <span className="facebook-logo"></span>
          Sign in with Facebook
        </button>
        </div>
        <br/><br/><a href="/login">Already have an account?</a>
      </form>
    </div>
    <img src={signupimg} style={{ position: 'absolute', bottom: '50px',  right: '50px', width: '400px', height: '400px' }}></img>
    </>
  );
};

export default SignUp;