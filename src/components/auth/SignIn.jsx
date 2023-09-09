import { signInWithEmailAndPassword , GoogleAuthProvider , FacebookAuthProvider , signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { Button , Navbar , Nav , Container} from "react-bootstrap";
import loginImg from "../../assets/loginImage.svg";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        window.sessionStorage.setItem("user_id", userCredential.user.uid);
        window.sessionStorage.setItem("user_email", userCredential.user.email);
        console.log(userCredential.user.uid);
        console.log(userCredential.user.email);
        navigate("/authentication");
      })
      .catch((error) => {
        if(error.code ==="auth/user-not-found")
        {
          setError("User not found");
          console.log(error.code);
        }
        else{
          setError("Wrong Password");
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

  const resetPassword = (e) => {
    e.preventDefault();
    navigate("/reset");
    
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
      <form onSubmit={signIn}>
        <h2>Log In to your Account</h2>
        Email address <br/><input
          type="email"
          placeholder="Enter your email"
          value={email}
          style={{ margin:"5px" , width: "400px"}}
          onChange={(e) => setEmail(e.target.value)}
        ></input><br/>
        Password <br/><input
          type="password"
          placeholder="Enter your password"
          value={password}
          style={{ margin:"5px" , width: "400px"}}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <br/>
        <br/>
        <Button variant="primary" type="submit">
          Log In
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
        <br/>
        <br/>
        <Button variant="outline-danger" onClick={resetPassword}>
          Reset Password
        </Button>
      </form>
    </div>
    <img src={loginImg} style={{ position: 'absolute', bottom: '50px',  right: '50px', width: '400px', height: '400px' }}></img>
    </>
  );
};

export default SignIn;