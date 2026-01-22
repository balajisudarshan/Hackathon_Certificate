const Certificate = require("../models/Certificate.model");

const issueCertificate = async (req, res) => {
  try {
    const { name, course, issuer, startingDate, endingDate } = req.body;
    if (!name || !course || !issuer) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (startingDate && isNaN(Date.parse(startingDate))) {
      return res.status(400).json({ message: "Invalid startingDate format" });
    }
    if (endingDate && isNaN(Date.parse(endingDate))) {
      return res.status(400).json({ message: "Invalid endingDate format" });
    }
    const dateOfIssue = new Date();
    const year = new Date().getFullYear();

    const lastCert = await Certificate.findOne(
      { certId: new RegExp(`CERT-${year}-`) },
      { certId: 1 },
    ).sort({ certId: -1 });

    let nextNumber = 1;

    if (lastCert) {
      const lastNumber = parseInt(lastCert.certId.split("-")[2], 10);
      nextNumber = lastNumber + 1;
    }

    const certId = `CERT-${year}-${String(nextNumber).padStart(6, "0")}`;
    const certificate = new Certificate({
      certId,
      name,
      course,
      issuer,
      dateOfIssue,
      startingDate,
      endingDate,
    });
    await certificate.save();
    res.status(201).json(certificate);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const getCertificate = async (req, res) => {
  try {
    const { certId } = req.params;
    if (!certId) {
      return res.status(400).json({ message: "certId is required" });
    }
    const certificate = await Certificate.findOne({ certId });
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    res.json(certificate);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = { issueCertificate, getCertificate };
