const RateLimiter = require("express-rate-limit");

const Limiter = RateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

module.exports = Limiter;
