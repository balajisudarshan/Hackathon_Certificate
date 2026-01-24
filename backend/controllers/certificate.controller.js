const Certificate = require("../models/Certificate.model");
const { sendCertificateEmail } = require("../utils/sendCertificateEmail");
const crypto = require("crypto");

const generateCertificateHash = (certId, name, course, issuer, dateOfIssue) => {
  const dataString = `${certId}|${name}|${course}|${issuer}|${dateOfIssue}`;
  return crypto.createHash("sha256").update(dataString).digest("hex");
};

const issueCertificate = async (req, res) => {
  try {
    const { name, course, email, issuer, startingDate, endingDate } = req.body;
    const emailLower = email.toLowerCase();
    if (!emailLower) {
      return res.status(400).json({ message: "Email is required" });
    }
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
    const hashValue = generateCertificateHash(
      certId,
      name,
      course,
      issuer,
      dateOfIssue,
    );
    const certificate = new Certificate({
      certId,
      name,
      course,
      email: emailLower,
      issuer,
      dateOfIssue,
      hashValue,
      startingDate,
      endingDate,
    });
    await certificate.save();
    try {
      await sendCertificateEmail(
        emailLower,
        certificate.certId,
        certificate.issuer,
      );
    } catch (err) {
      console.error("Email failed:", err.message);
    }
    res.status(201).json(certificate);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const verifyCertificate = async (req, res) => {
  try {
    const { certId } = req.params;
    if (!certId) {
      return res.status(400).json({ message: "certId is required" });
    }
    const certificate = await Certificate.findOne({ certId });
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    const dataString = `${certificate.certId}|${certificate.name}|${certificate.course}|${certificate.issuer}|${certificate.dateOfIssue}`;
    const recalculatedHash = crypto
      .createHash("sha256")
      .update(dataString)
      .digest("hex");
    const isValid = recalculatedHash === certificate.hashValue;
    res.status(200).json({
      certificate,
      valid: isValid,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
const updateCertificateStatus = async (req, res) => {
  try {
    const status = req.body.status;
    const certId = req.params.certId;
    if (!status || !certId) {
      return res
        .status(400)
        .json({ message: "status and certId are required" });
    }
    const certificate = await Certificate.findOne({ certId });
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    if (!["active", "revoked", "expired"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    if (certificate.status === "expired") {
      return res
        .status(400)
        .json({ message: "Certificate is already expired" });
    }
    if (certificate.status === status) {
      return res
        .status(200)
        .json({ message: "Certificate status is already up to date" });
    }
    certificate.status = status;
    await certificate.save();
    res
      .status(200)
      .json({ message: "Certificate status updated successfully" });
  } catch (err) {
    console.error("Error updating certificate statuses:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const getCertificateById = async (req, res) => {
  try {
    const { certId } = req.params;
    if (!certId) {
      return res.status(400).json({ message: "certId is required" });
    }
    const certificate = await Certificate.findOne({ certId });
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    res.status(200).json(certificate);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const getAllCertificates = async (req, res) => {
  try {
    // const { page = 1, limit = 10, issuer, course, valid } = req.query;

    // const query = {};

    // if (issuer) {
    //   query.issuer = issuer;
    // }

    // if (course) {
    //   query.course = course;
    // }

    // if (valid !== undefined) {
    //   query.expired = valid === "false";
    // }

    // const skip = (page - 1) * limit;

    // const [certificates, total] = await Promise.all([
    //   Certificate.find(query)
    //     .sort({ dateOfIssue: -1 })
    //     .skip(skip)
    //     .limit(Number(limit)),

    //   Certificate.countDocuments(query),
    // ]);

    // res.status(200).json({
    //   meta: {
    //     total,
    //     page: Number(page),
    //     limit: Number(limit),
    //     totalPages: Math.ceil(total / limit),
    //   },
    //   data: certificates,
    // });

    const certificates = await Certificate.find().sort({ dateOfIssue: -1 });
    res.status(200).json(certificates);
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

const deleteCertificateById = async (req, res) => {
  try {
    const { certId } = req.params;
    if (!certId) {
      return res.status(400).json({ message: "certId is required" });
    }
    const certificate = await Certificate.findOne({ certId });
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    await Certificate.deleteOne({ certId });
    res
      .status(200)
      .json({ message: "Certificate deleted successfully", certificate });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = {
  issueCertificate,
  verifyCertificate,
  updateCertificateStatus,
  getCertificateById,
  getAllCertificates,
  deleteCertificateById,
};
