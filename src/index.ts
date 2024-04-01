import { Hono } from 'hono';
import todoRouter from '@src/routers/todos';

const app = new Hono().basePath('/api');
app.route('/todos', todoRouter);

export default app;
