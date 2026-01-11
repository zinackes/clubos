import { z } from 'zod';

export const userRoleValidator = z.object({
  roles: z
    .array(z.enum(["owner", "coach", "player", "parent", "child", "visitor"]))
    .min(1, "Au moins un rôle est requis")
});

export const roleEnumValidator = z.enum(
  ["owner", "coach", "player", "parent", "child", "visitor"],
  "Le rôle sélectionné est invalide"
);

export interface userRoleType {
  id: string,
  role: roleEnum | null,
  userId: string,
}

export type roleEnum = z.infer<typeof roleEnumValidator>;
export type UserRole = z.infer<typeof userRoleValidator>;
