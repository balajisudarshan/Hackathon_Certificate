const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  issueCertificate,
  getCertificate,
} = require("../controllers/certificate.controller");

router.post("/issue", authMiddleware, issueCertificate);
router.get("/:certId", getCertificate);

module.exports = router;
