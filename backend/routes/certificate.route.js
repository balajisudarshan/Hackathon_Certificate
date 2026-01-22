const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  issueCertificate,
  verifyCertificate,
  updateCertificateStatus,
  getCertificateById,
  getAllCertificates,
} = require("../controllers/certificate.controller");

router.post("/issue", issueCertificate);
router.get("/verify/:certId", verifyCertificate);
router.get("/:certId", getCertificateById);
router.put("/status/:certId", authMiddleware, updateCertificateStatus);
router.get("/all", authMiddleware, getAllCertificates);
module.exports = router;
