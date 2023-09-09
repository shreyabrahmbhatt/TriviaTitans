import React, { useState , useEffect} from "react";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";
import authenticationImg from "../../assets/authentication.svg";
import { Button } from "react-bootstrap";

const Authentication = () => {
  const [authUser, setAuthUser] = useState(null);
  const [question1, setquestion1] = useState("");
  const [question2, setquestion2] = useState("");
  const [question3, setquestion3] = useState("");
  const [userquestion1, setuserquestion1] = useState("");
  const [userquestion2, setuserquestion2] = useState("");
  const [userquestion3, setuserquestion3] = useState("");
  const [useranswer1, setuseranswer1] = useState("");
  const [useranswer2, setuseranswer2] = useState("");
  const [useranswer3, setuseranswer3] = useState("");
  const [answer1, setanswer1] = useState("");
  const [answer2, setanswer2] = useState("");
  const [answer3, setanswer3] = useState("");
  const navigate = useNavigate();

  const getAPI = "https://ty5uk6v4k3wpsy6rarv56cpduy0hrnbj.lambda-url.us-east-1.on.aws/";
  const storeAPI = "https://otzzjrm7xhwkhtd2qp5mgby55q0cgpgp.lambda-url.us-east-1.on.aws/";

  useEffect(() => {
    const getData = async () => {
      try{
        const response = await axios.post(getAPI, {"id": window.sessionStorage.getItem("user_id")});
        console.log(JSON.parse(response.data.body));
        console.log(JSON.parse(response.data.body).Items[0].q1);
        setquestion1(JSON.parse(response.data.body).Items[0].q1);
        setquestion2(JSON.parse(response.data.body).Items[0].q2);
        setquestion3(JSON.parse(response.data.body).Items[0].q3);
        setuseranswer1(JSON.parse(response.data.body).Items[0].a1);
        setuseranswer2(JSON.parse(response.data.body).Items[0].a2);
        setuseranswer3(JSON.parse(response.data.body).Items[0].a3);
    }
    catch(error){
      console.log(error);
  }
  }
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    getData(); 
    listen();

  }, [])

  const authenticate = (e) => {
    e.preventDefault();
    console.log(useranswer1);
    console.log(useranswer2);
    console.log(useranswer3);
    console.log(answer1);
    console.log(answer2);
    console.log(answer3);
    if(useranswer1===answer1 && useranswer2===answer2 && useranswer3===answer3)
      navigate("/");
    else{
      alert("Invalid answers");
      userSignOut();
      navigate("/login");
    }
  };

  const store = (e) => {
    e.preventDefault();
    console.log(userquestion1);
    console.log(userquestion2);
    console.log(userquestion3);
    console.log(answer1);
    console.log(answer2);
    console.log(answer3);

    console.log(window.sessionStorage.getItem("user_id"));
    console.log(window.sessionStorage.getItem("user_email"));

    const body = {
      "user_id": window.sessionStorage.getItem("user_id"),
      "user_email": window.sessionStorage.getItem("user_email"),
      "q1": userquestion1,
      "q2": userquestion2,
      "q3": userquestion3,
      "a1": answer1,
      "a2": answer2,
      "a3": answer3,
      "team_name": "",
      "team_id": ""
    }

    console.log(body);
    
    axios.post(storeAPI,body)
    .then((response) =>{
        console.log(response.data);
        navigate("/login");
      })
      .catch((error) => {console.log(error);})
  };

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
    {authUser ? (
      <>
        <div style={{textAlign: "left", marginLeft: "40px" , marginTop:"40px"}} className="sign-in-container">
        <form onSubmit={authenticate}>
          <h2 >Please provide answers to below questions</h2><br/>
          <h4 style={{marginTop: "10px" , marginBottom: "10px"}}>{question1}</h4>
          <input
            type="password"
            placeholder="Enter your answer to Question1"
            value={answer1}
            style={{width: "400px" , marginTop: "5px" , marginBottom: "10px"}}
            onChange={(e) => setanswer1(e.target.value)}
          ></input>
          <h4 style={{marginTop: "10px" , marginBottom: "10px"}}>{question2}</h4>
          <input
            type="password"
            placeholder="Enter your answer to Question2"
            value={answer2}
            style={{width: "400px" , marginTop: "5px" , marginBottom: "10px"}}
            onChange={(e) => setanswer2(e.target.value)}
          ></input>
          <h4 style={{marginTop: "10px" , marginBottom: "10px"}}>{question3}</h4>
          <input
            type="password"
            placeholder="Enter your answer to Question3"
            value={answer3}
            style={{width: "400px", marginTop: "5px" , marginBottom: "10px"}}
            onChange={(e) => setanswer3(e.target.value)}
          ></input>
          <br/>
          <br/>
          <Button variant="outline-primary" type="submit">Submit</Button>
        </form>
        </div>
        <img src={authenticationImg} style={{ position: 'absolute', bottom: '50px',  right: '50px', width: '400px', height: '400px' }}></img>
      </>
    ) : (
      <>
        <div style={{textAlign: "left", marginLeft: "40px" , marginTop:"40px"}} className="sign-in-container">
        <form onSubmit={store}>
          <h2 style={{margin: "5px"}}>Please provide security and answers</h2><br/>
          <h4 style={{marginTop: "10px" , marginBottom: "10px"}}>Question-1</h4>
          <input
            type="text"
            placeholder="Enter your Question1"
            value={userquestion1}
            style={{width: "400px", marginTop: "5px" , marginBottom: "10px"}}
            onChange={(e) => setuserquestion1(e.target.value)}
          ></input>
          <h4 style={{marginTop: "10px" , marginBottom: "10px"}}>Answer-1</h4>
          <input
            type="password"
            placeholder="Enter your answer to Question1"
            value={answer1}
            style={{width: "400px", marginTop: "5px" , marginBottom: "10px"}}
            onChange={(e) => setanswer1(e.target.value)}
          ></input>
          <h4 style={{marginTop: "10px" , marginBottom: "10px"}}>Question-2</h4>
          <input
            type="text"
            placeholder="Enter your Question2"
            value={userquestion2}
            style={{width: "400px", marginTop: "5px" , marginBottom: "10px"}}
            onChange={(e) => setuserquestion2(e.target.value)}
          ></input>
          <h4 style={{marginTop: "10px" , marginBottom: "10px"}}>Answer-2</h4>
          <input
            type="password"
            placeholder="Enter your answer to Question2"
            value={answer2}
            style={{width: "400px", marginTop: "5px" , marginBottom: "10px"}}
            onChange={(e) => setanswer2(e.target.value)}
          ></input>
          <h4 style={{marginTop: "10px" , marginBottom: "10px"}}>Question-3</h4>
          <input
            type="text"
            placeholder="Enter your Question3"
            value={userquestion3}
            style={{width: "400px", marginTop: "5px" , marginBottom: "10px"}}
            onChange={(e) => setuserquestion3(e.target.value)}
          ></input>
          <h4 style={{marginTop: "10px" , marginBottom: "10px"}}>Answer-3</h4>
          <input
            type="password"
            placeholder="Enter your answer to Question3"
            value={answer3}
            style={{width: "400px", marginTop: "5px" , marginBottom: "10px"}}
            onChange={(e) => setanswer3(e.target.value)}
          ></input>
          <br/>
          <br/>
          <Button variant="outline-primary" type="submit">Submit</Button>
        </form>
        </div>
        <img src={authenticationImg} style={{ position: 'absolute', bottom: '50px',  right: '50px', width: '400px', height: '400px' }}></img>
      </>
    )}
  </div>
    
  );
};

export default Authentication;