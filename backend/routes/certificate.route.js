const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  issueCertificate,
  verifyCertificate,
  updateCertificateStatus,
  getCertificateById,
  getAllCertificates,
  deleteCertificateById,
} = require("../controllers/certificate.controller");

router.post("/issue", issueCertificate);
router.get("/getAll", getAllCertificates);

router.get("/verify/:certId", verifyCertificate);
router.get("/:certId", getCertificateById);
router.put("/status/:certId", authMiddleware, updateCertificateStatus);
router.delete("/delete/:certId", authMiddleware, deleteCertificateById);
module.exports = router;
