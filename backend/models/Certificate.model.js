const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
  certId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  issuer: {
    type: String,
    required: true,
  },
  dateOfIssue: {
    type: Date,
    required: true,
  },
  hashValue: {
    type: String,
    required: true,
  },
  signatureUrl: {
    type: String,
  },
  qrCodeUrl: {
    type: String,
  },
  startingDate: {
    type: Date,
  },
  endingDate: {
    type: Date,
  },
  expiryDate: {
    type: Date,
  },
  expired: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["active", "revoked", "expired"],
    default: "active",
  },
});

const Certificate = mongoose.model("Certificate", CertificateSchema);

module.exports = Certificate;
