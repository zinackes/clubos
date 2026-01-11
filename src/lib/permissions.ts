import type { roleEnum, userRoleType } from "@/shared/types/UserRole";


export function hasUserPermission(roles: userRoleType[], rolesNeeded: roleEnum[]) : boolean{
  return roles.some(role => rolesNeeded.some(roleNeeded => roleNeeded === role.role));
}
