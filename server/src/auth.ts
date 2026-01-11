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
  accountRelations,
} from "./db/schema";
import { resend } from "./helpers/email";
import { customSession, emailOTP } from "better-auth/plugins";
import { userRole } from "@db/schema/user-role";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  debug: true,
  siteUrl: "http://localhost:5173",
  trustedOrigins: ["http://localhost:5173"],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 3600 * 24,
    }
  },
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
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.log("email");
      console.log(user);
      const mail = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: user.email,
        subject: "Verification de votre adresse mail",
        html: `Click the link to verify your email: ${url}`,
      });

      console.log(mail);
    },
  },
  user: {
    additionalFields: {
      first_name: {
        type: "string",
        required: false,
      },
      last_name: {
        type: "string",
        required: false,
      },
    },
  },
  socialProviders: {
    google: {
      accessType: "offline",
      prompt: "select_account consent",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectUri: "http://localhost:5173",
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    },
  },
  callbacks: {
    async createUser({ user, profile, account }) {
      console.log("on passe la");
      if (account?.provider === "facebook") {
        const [firstName, ...rest] = (profile.name ?? "").split(" ");

        return {
          ...user,
          first_name: profile.first_name ?? firstName ?? "test",
          last_name: profile.last_name ?? rest.join(" ") ?? "test",
        };
      }

      return user;
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
        } else if (type === "email-verification") {
        } else {
        }
      },
    }),
    customSession(async ({ user, session}) => {
      const roles = await db.select().from(userRole).where(eq(userRole.userId, session.userId));
      
      return {
          roles: roles ?? [],
          user,
          session
      }
    })
  ],
});

type Session = typeof auth.$Infer.Session;
