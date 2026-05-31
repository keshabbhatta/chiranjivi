const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const protect = async (
  req,
  res,
  next
) => {

  try {

    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const token =
      authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      id: decoded.id,
    };

    next();

  } catch (error) {

    console.log(error);

    return res.status(401).json({
      message: "Token failed",
    });
  }
};

const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin only.",
      });
    }
    
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      message: "Admin verification failed",
    });
  }
};

module.exports = {
  protect,
  adminOnly,
};