import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { auth } from "./auth";
import { authRoutes } from "./routes/auth";
import { clubRoutes } from './routes/club';

// 1. On définit le type du contexte pour avoir l'autocomplétion sur c.get/c.set
type Env = {
    Variables: {
        user: typeof auth.$Infer.Session.user | null;
        session: typeof auth.$Infer.Session.session | null;
    }
}

const app = new Hono<Env>()

// 2. Les middlewares (ils ne sont pas inclus dans l'AppType du RPC, c'est normal)
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

    if (!session) {
        c.set("user", null);
        c.set("session", null);
    } else {
        c.set("user", session.user);
        c.set("session", session.session);
    }
    await next();
});
const routes = app
    .get("/session", (c) => {
        const session = c.get("session")
        const user = c.get("user")

        if (!user) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        return c.json({
            session,
            user
        });
    })
    .get('/hello', (c) => {
        return c.json({ message: 'Hello Hono!' })
    })
    .route("/api/user-management", authRoutes)
    .route("/api/club", clubRoutes);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
});

export type AppType = typeof routes;

export default app;
