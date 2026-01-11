import { relations } from "drizzle-orm";
import * as usersSchema from "./user-schema";
import * as authSchema from "./auth-schema";
import * as rolesSchema from "./user-role";
import * as clubSchema from "./club-schema";

export const user = usersSchema.user;
export const roleEnum = usersSchema.roleEnum;
export const session = authSchema.session;
export const account = authSchema.account;
export const verification = authSchema.verification;
export const userRole = rolesSchema.userRole;
export const fieldTypeEnum = clubSchema.fieldTypeEnum;
export const clubTable = clubSchema.clubTable;
export const customFieldClub = clubSchema.customFieldClub;
export const clubSeason = clubSchema.clubSeason;

// --- DÉFINITION DES RELATIONS ---

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  userRoles: many(userRole),
  clubs: many(clubTable),
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

export const clubRelations = relations(clubTable, ({one, many}) => ({
  user: one(user, {
    fields: [clubTable.directorId],
    references: [user.id]
  }),
  customFields: many(customFieldClub),
  seasons: many(clubSeason),
}))

export const customFieldClubRelations = relations(customFieldClub, ({ one }) => ({
  club: one(clubTable, {
    fields: [customFieldClub.clubId],
    references: [clubTable.id],
  }),
}));

export const clubSeasonRelations = relations(clubSeason, ({ one }) => ({
  club: one(clubTable, {
    fields: [clubSeason.clubId],
    references: [clubTable.id],
  }),
}));
