import type { Hono } from 'hono';
import { validator } from 'hono/validator';
import { z } from 'zod';
import type GetTodosController from '@src/controllers/todo/GetTodosController';

const getTodosSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).optional().default(10),
});

export const addRouteForGetTodos = ({
  todoRouter,
  getTodosController,
}: { todoRouter: Hono; getTodosController: GetTodosController }) => {
  todoRouter.get(
    '/',
    validator('query', (value, c) => {
      const parsed = getTodosSchema.safeParse(value);

      if (!parsed.success) {
        return c.json({ error: parsed.error }, 400);
      }

      return parsed.data;
    }),
    async (c) => {
      const { page, limit } = c.req.valid('query');
      const result = await getTodosController.handle({ page, limit });

      return c.json(result, 200);
    },
  );
};
