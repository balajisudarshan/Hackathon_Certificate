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
});

const Certificate = mongoose.model("Certificate", CertificateSchema);

module.exports = Certificate;
