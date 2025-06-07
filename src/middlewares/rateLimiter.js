import rateLimit from "express-rate-limit";

export const createLinkLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // milliseconds, 10 minutes
  max: 10,
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
