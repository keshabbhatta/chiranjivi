const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// REGISTER
const register = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      role,
    } = req.body;

    // CHECK USER
    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // CREATE USER
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // TOKEN
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      success: true,
      token,
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Register failed",
    });
  }
};


// LOGIN
const login = async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    // FIND USER
    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // CHECK PASSWORD
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // TOKEN
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Login failed",
    });
  }
};


// PROFILE
const getProfile = async (req, res) => {

  try {

    const user =
      await User.findById(req.user.id)
        .select("-password");

    res.json(user);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};


module.exports = {
  register,
  login,
  getProfile,
};