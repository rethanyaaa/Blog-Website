import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";  // Import CORS
import Router from "./routes/route.js";

const app = express();
dotenv.config();

// CORS configuration
app.use(cors({
  origin: "https://blogwebsite318.netlify.app",  // Replace with your frontend domain
  methods: ["POST", "GET", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
}));

// Use built-in middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const MONGO_URL = process.env.MONGO_DB;
async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
  } catch (error) {
    console.error("Error connecting to DB:", error);
  }
}

main();

// Use the router for API routes
app.use("/", Router);

// Set the port and start the server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
