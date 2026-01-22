const express = require("express");
const cors = require("cors");
const certificateRoutes = require("./routes/certificate.route");
const connectDb = require("./config/db");
const app = express();
require("dotenv").config();
app.use(cors());

app.use(express.json());
app.use("/api/certificates", certificateRoutes);

const PORT = process.env.PORT;
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
