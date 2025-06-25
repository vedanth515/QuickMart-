// middlewares/authSeller.js

import jwt from "jsonwebtoken";

// Middleware to authenticate seller using cookie
const authSeller = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.sellerToken;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token found" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if email matches the predefined seller email
    if (decoded.email === process.env.SELLER_EMAIL) {
      next();
    } else {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid seller" });
    }

  } catch (error) {
    console.error("authSeller error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authSeller;
