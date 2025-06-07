// src/models/link.model.js
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const visits = sqliteTable("visits_table", {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
    linkId: text("link_id").notNull(),
    clicked_at: text("clicked_at").default(() => new Date().toISOString()),
    user_agent: text("user_agent"),
    ip_address: text("ip_address"),
    referrer: text("referrer"),
    country: text("country"),
});
