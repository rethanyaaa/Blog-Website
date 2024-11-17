import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";  
import Router from "./routes/route.js";

const app = express();
dotenv.config();

// Use built-in middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS (optional, remove if not needed)
app.use(cors());

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
