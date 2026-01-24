const cron = require("node-cron");
const Certificate = require("../models/Certificate.model");
// const { sendCertificateExpiryEmail } = require("../utils/sendCertificateEmail"); // Disabled for free tier deployment

const certificateExpiryCron = cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();

    const expiredCertificates = await Certificate.find({
      expiryDate: { $lt: now },
      isExpired: false,
    });

    if (expiredCertificates.length === 0) {
      console.log("[CRON] No expired certificates to process");
      return;
    }

    await Certificate.updateMany(
      {
        expiryDate: { $lt: now },
        isExpired: false,
      },
      { isExpired: true },
    );

    for (const cert of expiredCertificates) {
      // Email notification disabled for free tier deployment
      // try {
      //   await sendCertificateExpiryEmail(
      //     cert.email,
      //     cert.certId,
      //     cert.organization,
      //   );
      //   console.log(`[CRON] Expiry email sent for certificate: ${cert.certId}`);
      // } catch (emailError) {
      //   console.error(
      //     `[CRON] Failed to send email for ${cert.certId}:`,
      //     emailError,
      //   );
      // }
    }

    console.log(
      `[CRON] Certificate expiry job completed. ${expiredCertificates.length} certificates marked as expired.`,
    );
  } catch (error) {
    console.error("[CRON] Certificate expiry job error:", error);
  }
});

certificateExpiryCron.on("error", (error) => {
  console.error("[CRON] Scheduler error:", error);
});

const healthCheckCron = cron.schedule("*/14 * * * *", async () => {
  try {
    const PORT = process.env.PORT || 3000;
    const response = await fetch(`http://localhost:${PORT}/health`, {
      method: "GET",
      timeout: 5000,
    });
    console.log(
      `[HEALTH CHECK] Status: ${response.status === 200 ? "✓ OK" : "✗ FAILED"}`,
    );
  } catch (error) {
    console.error("[HEALTH CHECK] Error:", error.message);
  }
});

healthCheckCron.on("error", (error) => {
  console.error("[HEALTH CHECK] Scheduler error:", error);
});

module.exports = certificateExpiryCron;
