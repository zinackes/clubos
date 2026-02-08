import { clubInvitationLinkTable } from "@db/schema";
import { eq } from "drizzle-orm";
import { db } from "src";


export const generateInvitationCode = (length: number = 8) : string => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);
    return Array.from(randomValues).map(v => charset[v % charset.length]).join('');
}

export const getUniqueInviteCode = async (): Promise<string> => {
    let code = "";
    let isUnique = false;
  
    while (!isUnique) {
      code = generateInvitationCode(8);
      const existing = await db.query.clubInvitationLinkTable.findFirst({
        where: eq(clubInvitationLinkTable.code, code),
      });
      if (!existing) isUnique = true;
    }

    return code;
  };