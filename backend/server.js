const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./cron/certificateExpiry");
const connectDb = require("./config/db");
const authRoutes = require("./routes/auth.route");

const certificateRoutes = require("./routes/certificate.route");
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(rateLimiter);
app.use(express.json());

// Health check endpoint (won't be rate limited - prevents Render spindown)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

app.use("/api/certificates", certificateRoutes);
app.use("/api/auth", authRoutes);

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on  http://localhost:${PORT}`);
  });
});
