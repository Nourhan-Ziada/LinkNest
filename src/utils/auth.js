import { betterAuth } from "better-auth";
import { users } from "../models/user.model.js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../database/db.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: users, 
    },
  }),
  secret: process.env.JWT_SECRET || "dfoajlfjopasdkfaidojiofqjofjoedw",
  expiresIn: "1h",
});
