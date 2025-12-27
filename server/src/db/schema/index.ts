import { relations } from "drizzle-orm";
import * as usersSchema from "./user-schema";
import * as authSchema from "./auth-schema";
import * as rolesSchema from "./user-role";

export const user = usersSchema.user;
export const roleEnum = usersSchema.roleEnum;
export const session = authSchema.session;
export const account = authSchema.account;
export const verification = authSchema.verification;
export const userRole = rolesSchema.userRole;

// --- DÉFINITION DES RELATIONS ---

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  userRoles: many(userRole),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const userRoleRelations = relations(userRole, ({ one }) => ({
  user: one(user, { fields: [userRole.userId], references: [user.id] }),
}));
