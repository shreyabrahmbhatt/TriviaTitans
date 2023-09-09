// Importing necessary modules and components
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signInWithGoogle } from "./firebase";
import { GoogleLoginButton } from "react-social-login-buttons";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";

// Login function component
function Login() {

  const [user, loading] = useAuthState(auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    // If the user object is defined, that means a user is logged in. In that case, navigate to the dashboard
    if (user) navigate("/dashboard");
  }, [user, loading]);

  // Rendering login page
  return (
    <>
    <div className="pageWrapper">
    <div className="heading" >
      <h2>👋 Welcome to Dashboard</h2>
      <p> Login access to the dashboard is only for registered admins.</p>
    </div>

      <div className="login">
      <div className="login__container">
        <GoogleLoginButton onClick={signInWithGoogle}>
        </GoogleLoginButton>

      </div>
    </div>
    </div>
    </>
  );
}

// Exporting Login component to be used in other parts of the app
export default Login;
