import { Hono } from 'hono'

const app = new Hono()
import { serve } from "@hono/node-server";
import {auth} from "./auth";
import { cors } from 'hono/cors';


app.use(
    "*",
    cors({
        origin: "http://localhost:5173",
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["POST", "GET", "OPTIONS"],
        exposeHeaders: ["Content-Length"],
        maxAge: 600,
        credentials: true,
    }),
);

app.use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if(!session) {
        // @ts-ignore
        c.set("user", null);
        // @ts-ignore
        c.set("session", null);
        await next();
        return;
    }

    // @ts-ignore
    c.set("user", session.user);
    // @ts-ignore
    c.set("session", session.session);
    await next();
})

app.get("/session", (c) => {
    // @ts-ignore
    const session = c.get("session")
    // @ts-ignore
    const user = c.get("user")

    if(!user) return c.body(null, 401);

    return c.json({
        session,
        user
    });
});

app.get('/', (c) => {
    return c.text('Hello Hono!')
})

app.on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
});

export default app
