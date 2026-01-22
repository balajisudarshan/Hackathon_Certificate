const { validateResult } = require("../validators/auth.validator");

const validateMiddleware = (req, res, next) => {
  const errors = validateResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = validateMiddleware;
