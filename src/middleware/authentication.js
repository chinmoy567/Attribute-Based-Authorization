import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/env.js";

export const verifyToken = (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: 401,
        message: "No token, authorization denied",
      });
    }

    // Verify token
    try {
      const decode = jwt.verify(token, jwtSecret);
      req.user = decode;
      next();
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: "Token is not valid",
      });
    }
  }
  else {
  return res.status(401).json({
    status: 401,
    message: "No token, authorization denied",});
  }
};
