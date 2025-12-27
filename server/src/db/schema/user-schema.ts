import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("user_role_enum", ["owner", "coach", "player", "parent", "child", "visitor"]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  first_name: text("first_name"),
  last_name: text("last_name"),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
