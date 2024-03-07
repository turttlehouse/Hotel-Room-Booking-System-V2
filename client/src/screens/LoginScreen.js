import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function Login() {
    setLoading(true);
    const user = {
      email,
      password,
    };

      //  Check if the email is a registered Gmail account
   if (!/@gmail\.com$/.test(email)) {
    setError("Please enter a valid registered Gmail account");
    setLoading(false);
    return; 
  }
    //console.log(user);
    try {
      const result = (await axios.post("/api/users/login", user)).data;
      console.log(result);
      localStorage.setItem("currentUser", JSON.stringify(result));

      if (result.isAdmin) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/home";
      }

    } catch (error) {
      console.log(error);
      setError("Invalid Credentials");
    }
    setLoading(false);
  }
  return (
    <div>
      {loading && <Loader></Loader>}

      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          {error.length > 0 && <Error msg={error}></Error>}
          <div className="bs">
            <h2>Login</h2>

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
              type="password"
              className="form-control"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {loading ? (
              <div>Login...Please Wait...</div>
            ) : (
              <button className="btn btn-primary mt-3" onClick={Login}>
                Login
              </button>
            )}
            <br />

            <p>Not Registered Yet?<Link to="/register" style={{color : 'blue', fontWeight:"bold" ,padding:10 }}>Register_Here</Link></p>
            <Link to="/forgot-password" style={{color : 'blue'}}>Forgot Password ?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
