import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/env.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: 401,
        message: "No token, authorization denied",
      });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
      next();
    } catch (error) {
      console.log("JWT Verification Error:", error.message);
      return res.status(400).json({
        status: 400,
        message: "Token is not valid",
      });
    }
  } else {
    return res.status(401).json({
      status: 401,
      message: "No token, authorization denied",
    });
  }
};