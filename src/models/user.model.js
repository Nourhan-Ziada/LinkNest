// src/models/user.model.js
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  email: text("email").unique().notNull(),
  hashed_password: text("hashed_password").notNull(),
  created_at: integer("created_at").notNull().$defaultFn(() => Date.now()),
});
