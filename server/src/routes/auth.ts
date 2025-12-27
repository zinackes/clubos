import { Hono } from 'hono'
import { db } from '..';
import { user } from '../db/schema/user-schema';
import { eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { userRoleValidator, roleEnum } from "@shared/types/UserRole";
import { userRole } from '../db/schema';


export const authRoutes = new Hono().post(
  "/signup-user-roles/:user_id",
  zValidator("json", userRoleValidator),
  async (c) => {
    try {
      const userId = c.req.param('user_id');
      const { roles } = c.req.valid("json");

      const userExists = await db.query.user.findFirst({
        where: eq(user.id, userId)
      });


      if (!userExists) return c.json({ error: "L'utilisateur n'existe pas" }, 404);

      if (roles.length > 0) {
        await db.insert(userRole).values(
          roles.map((role) => ({
            userId: userId,
            role: role,
          }))
        );
      }

      return c.json({ message: "Les roles ont été ajoutés à l'utilisateur"}, 200);

    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

export type AuthRoutes = typeof authRoutes;
