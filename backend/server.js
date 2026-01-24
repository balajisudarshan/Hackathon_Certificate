const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./cron/certificateExpiry");
const connectDb = require("./config/db");
const authRoutes = require("./routes/auth.route");
const rateLimiter = require("./middleware/rate-limiter.middleware");
const certificateRoutes = require("./routes/certificate.route");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(rateLimiter);
app.use(express.json());

// Health check endpoint (won't be rate limited - prevents Render spindown)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

app.use("/api/certificates", certificateRoutes);
app.use("/api/auth", authRoutes);

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[SERVER] Running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("[SERVER] Failed to start:", err.message);
    process.exit(1);
  });
