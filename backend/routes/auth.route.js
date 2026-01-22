const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");
const { registerValidator } = require("../validators/auth.validator");
const validate = require("../middleware/validate.middleware");
const {
  login,
  register,
  getAllUsers,
} = require("../controllers/auth.controller");

router.post("/login", login);
router.post("/register", registerValidator, validate, register);
router.get("/getallusers", authMiddleware, getAllUsers);

module.exports = router;
