const express = require("express");
const router = express.Router();

const User = require("../models/user");
const sendEmail = require ('../services/sendEmail');

const bcrypt = require('bcryptjs');


router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is a Gmail account
    if (!/@gmail\.com$/.test(email)) {
      return res.status(400).json({ message: "Please enter a valid Gmail account (example@gmail.com)" });
    }

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "email already exists" });

    }

    
    const hashgariyekopassword = await bcrypt.hash(password,8); 

    const newUser = new User({ name, email, password:hashgariyekopassword });
    // const newUser = new User({ name, email, password });

    const users = await newUser.save();
    if (users) {
      res.send("User Registered Successfully");
    }

  } catch (error) {
    return res.status(400).json({ message: error });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email is a Gmail account
    if (!/@gmail\.com$/.test(email)) {
      return res.status(400).json({ message: "Please enter a valid Gmail account (example@gmail.com)" });
    }

    // Check if the user exists with the provided email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const PasswordMatchVayo = await bcrypt.compare(password, user.password);
    // const users = await User.findOne({ email: email, password: password });
    if(PasswordMatchVayo)
    {

      const temp = {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        _id: user._id,
      };
      res.send(temp);

    }
      
     else {
      return res.status(400).json({ message: "Login Failed" });
    }
    
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});


router.post("/getallusers", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

// forgot password
router.post("/forgot-password", async (req, res) => {
  try {
      const { email } = req.body;
      if (!email) {
          return res.status(400).json({ message: "Please provide email" });
      }

      // check if that email is registered or not
      const userExist = await User.findOne({ email: email });



      if (userExist.length == 0) {
          return res.status(404).json({ message: "Email is not registered" });
      }

      // send otp to that email
      const otp = Math.floor(1000 + Math.random() * 9000);
      console.log(otp);
  
      
      await sendEmail({
          email: email,
          subject: "Your Otp for Hotel-Room-Booking forgotPassword",
          message: `${otp}`
      });

      const updatedUser = await User.findOneAndUpdate(
        { email: email },
        { $set: { otp: otp } },
        { new: true }
      );
  


      res.status(200).json({ message: "OTP sent successfully", data: email });
  } catch (error) {
      return res.status(400).json({ message: error.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Please provide email and otp" });
    }
    
    // check if that otp is correct or not for that email
    const user = await User.findOne({ email: email }).select("+otp +isOtpVerified");
    if (!user) {
      return res.status(404).json({ message: "Email is not registered" });
    }
    
    // Convert otp to string for accurate comparison
    const otpFromUser = user.otp.toString();
    const otpFromRequest = otp.toString();

    if (otpFromUser !== otpFromRequest) {
      return res.status(400).json({ message: "Invalid otp" });
    } else {
      // dispose the otp so it cannot be used next time
      user.otp = undefined;
      user.isOtpVerified = true;
      await user.save();
      res.status(200).json({ message: "Otp is correct" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});


// reset password
router.post("/reset-password", async (req, res) => {
  try {
      const { email, newPassword, confirmPassword } = req.body;
      if (!email || !newPassword || !confirmPassword) {
          return res.status(400).json({ message: "Please provide email, newPassword, and confirmPassword" });
      }
      if (newPassword !== confirmPassword) {
          return res.status(400).json({ message: "New password and confirm password do not match" });
      }

      const user = await User.findOne({ email: email }).select("+isOtpVerified");
      if (!user) {
          return res.status(404).json({ message: "User email not registered" });
      }

      if (!user.isOtpVerified) {
          return res.status(403).json({ message: "You cannot perform this action" });
      }

      // Update password directly without hashing
      user.password = newPassword;
      user.isOtpVerified = true;
      await user.save();

      res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
      return res.status(400).json({ message: error.message });
  }
});

router.delete("/delete-account/:userId", async (req, res) => {
  try {
    //     const { userId } = req.params;
    //     // Optionally add authentication to verify the user's identity

    //     await User.deleteOne({ _id: userId });
    //     res.json({ message: "Account deleted successfully" });
    //   } catch (error) {
    //     console.log(error);
    //     return res.status(400).json({ message: error.toString() });
    //   }
    // });

    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
});

module.exports = router;
