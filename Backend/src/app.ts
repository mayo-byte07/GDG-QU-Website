import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import dotenv from "dotenv";

dotenv.config();

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : [];
const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
};

const app = express();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Health check route
app.get("/", (_, res) => {
    res.send("Api is running...");
});

// Import and use routes
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import eventRouter from "./routes/event.route.js";
import teamRouter from "./routes/team.route.js";
import wallOfFameRouter from "./routes/wallOfFame.route.js";
import projectRouter from "./routes/project.routes.js";
import contactRouter from "./routes/contact.route.js";


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);
app.use("/api/team", teamRouter);
app.use("/api/project", projectRouter);
app.use("/api/wof", wallOfFameRouter);
app.use("/api/contact", contactRouter);

// Error handling middleware
app.use(errorHandler);

export default app;
