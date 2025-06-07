import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { auth } from "../utils/auth.js";
const authRouter = express.Router();

authRouter.use('/', auth);

// authRouter.post("/register", registerUser);
// authRouter.post("/login", loginUser);

export default authRouter;