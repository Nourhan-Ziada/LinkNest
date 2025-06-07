// src/database/db.js
import { drizzle } from "drizzle-orm/better-sqlite3";
import  Database from "better-sqlite3";
import { links } from "../models/link.model.js";
import { users } from "../models/user.model.js";

const sqlite = new Database("linknest.db");

export const db = drizzle(sqlite, {
  schema: { links, users },
});
