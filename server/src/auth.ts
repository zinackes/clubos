// Fichier: auth.ts (ou index.ts, là où vous configurez betterAuth)

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./index"; // Votre connexion à la BDD
// 1. ➡️ Importez vos tables du fichier renommé (auth-schema)
//    (Ajustez le chemin si nécessaire)
import {
    user,
    session,
    account,
    verification,
    userRelations,
    sessionRelations,
    accountRelations
} from "./db/schema/auth-schema";


export const auth = betterAuth({
    siteUrl: "http://localhost:5173",
    trustedOrigins: ["http://localhost:5173"],
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: user,
            session: session,
            account: account,
            verification: verification,
            userRelations: userRelations,
            sessionRelations: sessionRelations,
            accountRelations: accountRelations,

        }
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            first_name: {
                type: "string",
                required: false
            },
            last_name: {
                type: "string",
                required: false
            }
        }
    },
    socialProviders: {
        google: {
            accessType: "offline",
            prompt: "select_account consent",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            redirectUri: "http://localhost:5173",
        }
    }
});