const User = require("../models/User.model");
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

    // VALIDATE INPUTS
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    // CHECK USER
    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // GENERATE DOCTOR USERNAME IF DOCTOR ROLE
    let doctorUsername = null;
    if (role === "doctor") {
      // Generate unique doctor username from name (e.g., "dr.john_smith", "doctor_jane_doe")
      const baseUsername = `dr.${name.toLowerCase().replace(/\s+/g, '_')}`;
      let uniqueUsername = baseUsername;
      let counter = 1;
      
      // Check if username exists and make it unique
      while (await User.findOne({ doctorUsername: uniqueUsername })) {
        uniqueUsername = `${baseUsername}${counter}`;
        counter++;
      }
      
      doctorUsername = uniqueUsername;
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
      ...(doctorUsername && { doctorUsername }),
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
      user: {
        ...user.toObject(),
        doctorUsername,
      },
    });

  } catch (error) {

    console.error("❌ Register Error:", error.message);

    res.status(500).json({
      message: error.message || "Register failed",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
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

    // VALIDATE INPUTS
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // FIND USER
    const user =
      await User.findOne({ email }).select("+password");

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

    // Update last login and set online status
    await User.findByIdAndUpdate(user._id, {
      lastLogin: new Date(),
      isOnline: true,
    });

    res.json({
      success: true,
      token,
      user: {
        ...user.toObject(),
        isOnline: true,
      },
    });

  } catch (error) {

    console.error("❌ Login Error:", error.message);

    res.status(500).json({
      message: error.message || "Login failed",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
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