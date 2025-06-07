import express from "express";
import linksRoute from './routes/link.routes.js'
import dotenv from "dotenv";
import logger from './middlewares/logger.js';
import { createLinkLimiter } from "./middlewares/rateLimiter.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth.js";
//import authRouter from './routes/auth.routes.js';
dotenv.config();

const app = express();

app.use(express.json());
app.use(logger);
//app.use(createLinkLimiter)


//Links Route
app.use('/api/links', linksRoute);
// Authentication Route
app.all('/api/auth/{*any}', (req, res, next) => {
  console.log(`Received request: ${req.method} ${req.path}`);
  toNodeHandler(auth)(req, res, next);
});



app.get("/", (req, res) => {
  res.send("LinkNest API is running 🚀");
});

export default app;
