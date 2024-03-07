
import React, { useState } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";

const ResetPassword = () => {
  const history = useHistory();
  const [email, setEmail] = useState(""); // State for email
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const { forgotPasswordData } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const data = {
      email, // Add email to data object
      newPassword,
      confirmPassword,
    };

    try {
      const response = await axios.post("/api/users/reset-password", data);
      if (response.status === 200) {
        alert("password reset successful!");
        setTimeout(() => {
          history.push("/login"); // Redirect to login page after displaying error message
        }, 2000); // Redirect after 2 seconds
      } else {
        alert("Password reset failed");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Something went wrong");
    }
  };

  return (

    <div  >
      <div className="row justify-content-center mt-5 " >


        <div className="col-md-5 mt-5">
          <div className="bs">
            <form onSubmit={handleSubmit} className="p-3 md:p-10">

              <h4>Reset Password</h4>

              <div >
                <input
                  type="email" // Set input type to email
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update email state onChange

                  placeholder="E-mail" // Placeholder for email
                />
              </div>
              <br />
              <div >
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}

                  placeholder="New-Password"
                />
              </div>
              <br />
              <div >
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}

                  placeholder="Confirm-Password"
                />
              </div><br />
              <button type="submit">Reset Password</button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
