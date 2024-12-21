const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and contains a Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Extract the token

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID stored in the token
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
