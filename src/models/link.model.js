// src/models/link.model.js
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const links = sqliteTable("links_table", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),

  original_url: text("original_url").notNull(),
  short_slug: text("short_slug").notNull().unique(),
  created_by: text("created_by"),
  created_at: text("created_at").notNull(),
  expires_at: text("expires_at"),
  click_count: integer("click_count").default(0),
  password_hash: text("password_hash"),
});
