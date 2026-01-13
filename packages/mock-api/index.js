import express from "express";
import morgan from "morgan";
import { supplyTreeMockResponse } from "./mock-data.js";

const app = express();

const PORT = 8001;

// Middleware to parse JSON
app.use(express.json());

//middleware for logging
app.use(morgan('tiny'));

// Basic route
app.get("/", (req, res) => {
  res.send("Hello from your first Node.js backend!");
});

app.post("/v1/match", (req, res) => {
  console.log("Received data:", req.body);
  res.status(200).json({ status: "OK", data: supplyTreeMockResponse });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
