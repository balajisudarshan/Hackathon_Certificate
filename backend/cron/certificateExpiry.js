const cron = require("node-cron");
const Certificate = require("../models/Certificate.model");

cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();
    const expiredCertificates = await Certificate.updateMany(
      {
        expiryDate: { $lt: now },
      },
      { isExpired: true },
    );
  } catch (error) {
    console.error("Error deleting expired certificates:", error);
  }
});

module.exports = cron;
