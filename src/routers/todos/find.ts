import type { Hono } from 'hono';
import { validator } from 'hono/validator';
import { z } from 'zod';
import type GetTodoController from '@src/controllers/todo/GetTodoController';

const getTodoSchema = z.object({
  id: z.coerce.number().int().min(1),
});

export const addRouteForGetTodo = ({
  todoRouter,
  getTodoController,
}: { todoRouter: Hono; getTodoController: GetTodoController }) => {
  todoRouter.get(
    '/:id',
    validator('param', (value, c) => {
      const parsed = getTodoSchema.safeParse(value);

      if (!parsed.success) {
        return c.json({ error: parsed.error }, 400);
      }

      return parsed.data;
    }),
    async (c) => {
      const { id } = c.req.valid('param');
      const result = await getTodoController.handle({ id });
      if (!result) {
        return c.json({ error: 'Not Found' }, 404);
      }

      return c.json(result, 200);
    },
  );
};
