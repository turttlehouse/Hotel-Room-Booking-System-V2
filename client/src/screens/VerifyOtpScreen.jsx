import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useParams } from 'react-router-dom';

import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";

 


const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const history = useHistory();

  const { forgotPasswordData } = useParams();
  
  console.log(forgotPasswordData);




  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/api/users/verify-otp", {
        email: "peshal077@gmail.com", // Hardcoded for example, you should replace it with the appropriate email
        otp: otp,
      });
      setSuccess(response.data.message);
      history.push("/reset-Password");
    } catch (error) {
      setError(error.response.data.message);
    }
    setLoading(false);
  };

  // useEffect(() => {
  //   // No need for this useEffect since we are not using Redux anymore
  // }, []);

  return (
    <div className="container">
    <div className="bs">
      {loading && <Loader />}
      {error && <Error msg={error} />}
      {success && <Success msg={success} />}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="otp">Enter OTP:</label>
          <input 
            type="text"
            id="otp"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div><br/>
        <button type="submit">Verify OTP</button>
      </form>
    </div>
    </div>
  );
};

export default VerifyOtp;
