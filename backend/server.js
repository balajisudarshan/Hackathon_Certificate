const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDb = require("./config/db");
const authRoutes = require("./routes/auth.route");
const rateLimiter = require("./middleware/RateLimiter.middleware");
const certificateRoutes = require("./routes/certificate.route");
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(rateLimiter);
app.use(express.json());
app.use("/api/certificates", certificateRoutes);
app.use("/api/auth", authRoutes);

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on  http://localhost:${PORT}`);
  });
});
