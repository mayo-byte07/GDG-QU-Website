import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

// Connect to the database globally (Mongoose automatically buffers queries until connected)
connectDB().catch((error) => {
  console.error("Failed to connect to the database:", error);
});

// Health check endpoint for Vercel
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "GDG Backend Running" });
});

// Vercel handles serverless routing automatically via the export below.
// We only invoke app.listen() if we are NOT running on Vercel (e.g., local Docker).
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the app for Vercel Serverless Functions
export default app;
