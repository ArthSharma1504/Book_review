const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header contains the Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Extract the token

      if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
      }

      // Verify the token and decode it
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Log decoded token to check
      console.log("Decoded Token:", decoded);

      // Find the user by the ID in the decoded token
      req.user = await User.findById(decoded.id).select("-password");

      // Check if user exists
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next(); // Proceed to the next middleware (the controller function)
    } catch (error) {
      console.error("Error during token verification:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
