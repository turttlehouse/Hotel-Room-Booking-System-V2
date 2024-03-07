import React, { useState } from "react";
import axios from "axios";
import { Link, useHistory } from 'react-router-dom';

import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";

const ForgotScreen = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const history = useHistory();

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const User ={
        email,
    };
    setError("");
    setSuccess("");

   
    try {
      const response = await axios.post("/api/users/forgot-password", { email });
      setSuccess(response.data.message);
  
      // Assuming response includes success message
      history.push("/verify-otp");
    } catch (error) {
      setError(error.response.data.message);
    }
    setLoading(false);
  };

  return (
    <div>
      {loading && <Loader />}
      {error && <Error msg={error} />}
      {success && <Success msg={success} />}
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          <div className="bs">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn btn-primary mt-3">Send OTP</button><br/>
              <p>Not Registered Yet?<Link to="/register" style={{color : 'blue', fontWeight:"bold" ,padding:10 }}>
                Register_Here</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotScreen;
