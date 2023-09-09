// Importing necessary libraries, components and functions
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth"; 
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

// Dashboard function component
function Dashboard() {

  const [user, loading] = useAuthState(auth);

  const [name, setName] = useState("");

  const navigate = useNavigate();

  // Async function to fetch user name from firestore
  const fetchUserName = async () => {
    try {
      // Create a query against the collection "users" where user uid matches
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));

      // Await the response, then get the data from the docs
      const doc = await getDocs(q);
      const data = doc.docs[0].data();

      // Set the user's name in local state
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;

    // If there's no user logged in, navigate back to the login page
    if (!user) return navigate("/");

    // Fetch user name when component mounts
    fetchUserName();
  }, [user, loading]); // Dependency array for useEffect, this effect runs whenever user or loading changes

  // Rendering Dashboard page
  return (
    <div className="dashboard">
      <div className="dashboard__container">
        Logged in as
        <div>{name}</div> 
        <div>{user?.email}</div>
        
        {/* Embedding an external dashboard into the page */}
        <iframe src="https://sdp5.retool.com/apps/a4d5c8ee-232e-11ee-862c-2bc0e2be14ce/SDP5-MAIN-DASHBOARD" width="1800px" height="1000px"></iframe>
        <button className="dashboard__btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

// Exporting Dashboard component to be used in other parts of the app
export default Dashboard;
