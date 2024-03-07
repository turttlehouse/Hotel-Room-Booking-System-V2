import React, { useState, useEffect } from "react";
import {  useHistory } from "react-router-dom";
import axios from "axios";
import { Link } from 'react-router-dom';



import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";

function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const  history = useHistory();

  async function register() {

    const gmailRegex = /@gmail\.com$/;

    if (!gmailRegex.test(email)) {
      setError("Please enter a valid Gmail account (example@gmail.com)");
      return; // Exit the function if the email format is incorrect
    }



    if (password === cpassword) {
      const user = {
        name,
        email,
        password,
        
      };
      //console.log(user);
      setLoading(true);
      setError("");
      setSuccess("");
      try {
        const result = (await axios.post("/api/users/register", user)).data;
        console.log(result);
        setSuccess(result);
        setName("");
        setEmail("");
        setPassword("");
        setCpassword("");
      } catch (error) {
        console.log( error.response.data.message);
        setError( error.response.data.message);
        if (error.response.data.message === "email already exists") {
          setTimeout(() => {
            history.push("/login"); // Redirect to login page after displaying error message
          }, 2000); // Redirect after 2 seconds
        }
      }
      setLoading(false);
    } else {
      alert("Password not matched");
    }
  }

  return (
    <div>
      {loading && <Loader></Loader>}
      {error.length > 0 && <Error msg={error}></Error>}

      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          {success.length > 0 && <Success msg={success}></Success>}
          <div className="bs">
            <h2>Register</h2>
            <input
              type="text"
              className="form-control"
              placeholder="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            /><br/>
            <input
              type="text"
              className="form-control"
              placeholder="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            /><br/>
            <input
              type="text"
              className="form-control"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            /><br/>
            <input
              type="text"
              className="form-control"
              placeholder="confirm password"
              value={cpassword}
              onChange={(e) => {
                setCpassword(e.target.value);
              }}
            /><br/>
            {loading ? (
              <div>Registering... Please Wait...</div>
            ) : (
              <button className="btn btn-primary mt-3" onClick={register}>
                Register
              </button>
            )}
             <br/>
              
             <p>Already Registered?<Link to="/login" style={{color : 'blue', fontWeight:"bold" ,padding:10 }}>Login_Here</Link></p><br/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;
