const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  issueCertificate,
  verifyCertificate,
  updateCertificateStatus,
} = require("../controllers/certificate.controller");

router.post("/issue", issueCertificate);//need to add later
router.get("/:certId", verifyCertificate);
router.put("/status/:certId", authMiddleware, updateCertificateStatus);
module.exports = router;
