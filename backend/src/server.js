// const express = require("express");
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";

config();
connectDB();

const app = express();

app.use(cookieParser());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}))

// API Routes
app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
app.use("/watchlist", watchlistRoutes);

// app.get("/hello", (req, res) => {
//     // res.send("<p>Hello world</p>")
//     res.json({message: "hello world"})
// })

const PORT = 5001;

const server = app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})

process.on("unhandledRejection", (err) => {
    console.error("unhandled Rejection", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    })
})

process.on("uncaughtException", async (err) => {
    console.error("uncaught Exception", err);
        await disconnectDB();
        process.exit(1);
})

process.on("SIGTERM", async () => {
    console.error("SIGTERM received. Shutting down gracefully");
    server.close(async () => {
        await disconnectDB();
        console.info("Closed all connections. Goodbye!");
        process.exit(0); // Exit code 0 means "Success/Planned"
    })
})