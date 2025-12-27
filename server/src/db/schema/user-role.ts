import { pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { user } from "./user-schema";
import { relations } from "drizzle-orm";
import { roleEnum } from "./user-schema";

export const userRole = pgTable("user_role", {
  id: text("id").primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  role: roleEnum("role").default("visitor"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const userRoleRelations = relations(userRole, ({ one }) => ({
  user: one(user, {
    fields: [userRole.userId],
    references: [user.id]
  })
}))
