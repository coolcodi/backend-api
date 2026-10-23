import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

// Middleware
app.use(helmet());

// Enable CORS for the frontend URL if specified in the environment variables
if (process.env.FRONTEND_URL) {
  app.use(cors({
    origin: process.env.FRONTEND_URL
  }));
}

// Parse incoming JSON requests
app.use(express.json());


// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running"
  });
});


export default app;