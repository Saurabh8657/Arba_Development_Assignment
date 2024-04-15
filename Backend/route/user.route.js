const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const { secretKey } = require("../Config/db");
const { UserModel } = require('../Models/user.model');
const { auth } = require("../Middlewares/authorization.middleware");

const userRouter = express.Router();

const validateRegistration = [
  check("fullName").notEmpty().withMessage("Name is required!"),
  check("userName").notEmpty().withMessage("User name is required!"),
  check("email").isEmail().withMessage("Valid email is required!"),
  check("password").notEmpty().withMessage("Password is required!"),
];

const validateLogin = [
  check("email").isEmail().withMessage("Valid email is required!"),
  check("password").notEmpty().withMessage("Password is required!"),
];



userRouter.get('/', (req, res) => {
  res.send({ msg: 'Welcome to user route' })
})


// Register
userRouter.post("/register", validateRegistration, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { fullName, userName, email, password } = req.body;
    const exist = await UserModel.findOne({ email });

    if (exist) {
      return res.status(400).json({
        msg: "User already exists with this email, try signin instead",
      })
    }

    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        return res.status(500).json({ msg: "Internal server error", err });
      } else {
        const user = await UserModel.create({
          fullName,
          userName,
          email,
          password: hash,
          avatar: "https://res.cloudinary.com/dezupfsqo/image/upload/v1712294594/zhzzgzdgq41bev2ivaka.jpg",
        });
        console.log(user);
        res.status(201).json({ msg: "Signup successful", user });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error", error });
  }
});

// Login
userRouter.post("/login", validateLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Please signup first" });
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        console.log(user._id);
        const token = jwt.sign({ userId: user._id }, secretKey);
        const userToSend = { name: user.fullName,  userName: user.userName, email: user.email, avatar: user.avatar }
        return res.status(200).json({
          msg: "Login successful",
          token: token,
          UserData: userToSend
        });
      } else {
        res.status(401).json({ msg: "Invalid credentials", error : err });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error", error });
  }
});

// Update profile
userRouter.patch("/profile/update", auth, async (req, res) => {
  const { fullName, password } = req.body;
  const userId = req.userId;

  try {
    let updates = {};
    if (fullName) updates.fullName = fullName;
    if (password) {
      const hash = await bcrypt.hash(password, 5);
      updates.password = hash;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not present in database" });
    }

    res.status(200).json({ msg: "Profile updated successfully", updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error", error });
  }
});


module.exports = {
  userRouter
}
