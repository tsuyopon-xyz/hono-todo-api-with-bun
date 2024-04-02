import type { Hono } from 'hono';
import { validator } from 'hono/validator';
import { z } from 'zod';
import type CreateTodoController from '@src/controllers/todo/CreateTodoController';

const createTodoSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

export const addRouteForCreateTodo = ({
  todoRouter,
  createTodoController,
}: { todoRouter: Hono; createTodoController: CreateTodoController }) => {
  todoRouter.post(
    '/',
    validator('json', (value, c) => {
      const parsed = createTodoSchema.safeParse(value);
      if (!parsed.success) {
        return c.json({ error: parsed.error }, 400);
      }

      return parsed.data;
    }),
    async (c) => {
      const { title, body } = c.req.valid('json');
      const result = await createTodoController.handle({ title, body });

      return c.json(result, 201);
    },
  );
};
