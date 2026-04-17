import express from "express";
import { port } from "./config/env.js";
import projectRoutes from "./routes/projectRoutes.js";  
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// middleware
app.use(express.json());

// route
app.use("/api/project", projectRoutes);

// error handling middleware
app.use(errorHandler);


// start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});