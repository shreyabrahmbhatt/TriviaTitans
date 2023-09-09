import React, { useEffect, useState } from "react";
import axios from "axios";

const UserData = () => {
    
    const API = "https://d3j5khjicc6nne7vpcddcccu7e0mzvmk.lambda-url.us-east-1.on.aws/";
    const API1 = "https://6m3ygcgska3s7lnongfkwsnske0dgctf.lambda-url.us-east-1.on.aws/";

    useEffect(() => {
        const getData = async () => {
            const response = await axios.get(API);
            console.log(JSON.parse(response.data.body));
            // console.log(JSON.parse(response.data.body).Items);
        }
        getData(); 
    }, [])

    const handleClick = (e) => {
        e.preventDefault();
        axios.post(API1,{user_id: "53", email: "aa@gmail.com"}).
            then((response) =>{
                console.log(response.data);
            })
            .catch((error) => {console.log(error);})
    }
    
    return (
        <>
      <p>Hello</p>
      <button onClick={handleClick}>Store</button>
      </>
    );
  };
  
  export default UserData;