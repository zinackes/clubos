import { createAuthClient } from "better-auth/react";
import {emailOTPClient, inferAdditionalFields} from "better-auth/client/plugins";
import type {auth} from "../../server/src/auth.ts";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000",
    plugins: [inferAdditionalFields<typeof auth>(),
        emailOTPClient()]
})