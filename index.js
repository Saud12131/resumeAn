import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import authroutes from "./routes/auth.js";
import resumeRoutes from "./routes/resume.js";

// Load environment variables
dotenv.config();
connectDB();
// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authroutes);
app.use("/api/resume", resumeRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("server is running");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
