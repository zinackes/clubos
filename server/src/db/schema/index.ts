import { InferSelectModel, relations } from "drizzle-orm";
import * as usersSchema from "./user-schema";
import * as authSchema from "./auth-schema";
import * as rolesSchema from "./user-role";
import * as clubSchema from "./club-schema";
import * as memberSchema from "./member-club-schema";

export const memberClubStatusEnum = memberSchema.memberClubStatusEnum;
export const memberClubRoleEnum = memberSchema.memberClubRoleEnum;
export const documentStatusEnum = memberSchema.documentStatusEnum;
export const paymentStatusEnum = memberSchema.paymentStatusEnum;

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
export const clubInvitationLinkTable = clubSchema.clubInvitationLinkTable;

export const memberClubTable = memberSchema.memberClubTable;
export const memberDocumentTable = memberSchema.memberDocumentTable;
export const memberPaymentTable = memberSchema.memberPaymentTable;
export const memberCustomValueTable = memberSchema.memberCustomValueTable;

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  userRoles: many(userRole),
  clubs: many(clubTable),
  memberships: many(memberClubTable),
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

export const clubRelations = relations(clubTable, ({ one, many }) => ({
  user: one(user, { fields: [clubTable.directorId], references: [user.id] }),
  customFields: many(customFieldClub),
  seasons: many(clubSeason),
  members: many(memberClubTable),
}));

export const customFieldClubRelations = relations(customFieldClub, ({ one, many }) => ({
  club: one(clubTable, { fields: [customFieldClub.clubId], references: [clubTable.id] }),
  values: many(memberCustomValueTable),
}));

export const clubSeasonRelations = relations(clubSeason, ({ one, many }) => ({
  club: one(clubTable, { fields: [clubSeason.clubId], references: [clubTable.id] }),
  members: many(memberClubTable),
}));

export const memberClubRelations = relations(memberClubTable, ({ one, many }) => ({
  user: one(user, { fields: [memberClubTable.userId], references: [user.id] }),
  club: one(clubTable, { fields: [memberClubTable.clubId], references: [clubTable.id] }),
  season: one(clubSeason, { fields: [memberClubTable.seasonId], references: [clubSeason.id] }),
  documents: many(memberDocumentTable),
  payments: many(memberPaymentTable),
  customValues: many(memberCustomValueTable),
  invitationLinks: many(clubInvitationLinkTable),
}));

export const memberDocumentRelations = relations(memberDocumentTable, ({ one }) => ({
  membership: one(memberClubTable, {
    fields: [memberDocumentTable.memberClubId],
    references: [memberClubTable.id],
  }),
}));

export const memberPaymentRelations = relations(memberPaymentTable, ({ one }) => ({
  membership: one(memberClubTable, {
    fields: [memberPaymentTable.membershipId],
    references: [memberClubTable.id],
  }),
}));

export const memberCustomValueRelations = relations(memberCustomValueTable, ({ one }) => ({
  membership: one(memberClubTable, {
    fields: [memberCustomValueTable.membershipId],
    references: [memberClubTable.id],
  }),
  customField: one(customFieldClub, {
    fields: [memberCustomValueTable.customFieldId],
    references: [customFieldClub.id],
  }),
}));


export type ClubInvitationLinkDbType = InferSelectModel<typeof clubInvitationLinkTable>;