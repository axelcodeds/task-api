const rateLimit = require("express-rate-limit");

// General API limiter - 30 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => req.path === "/health", // Don't limit health checks
});

// Auth limiter - stricter for login/register (5 attempts per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many auth attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count all requests, even successful ones
});

module.exports = {
  apiLimiter,
  authLimiter,
};
