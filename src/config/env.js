import dotenv from "dotenv";

dotenv.config();

// App port
export const port = process.env.PORT || 5002;

// JWT secret key
export const jwtSecret = process.env.JWT_SECRET || "dev_secret_key";