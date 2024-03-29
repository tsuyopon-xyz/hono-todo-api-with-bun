import { Hono } from 'hono';

const app = new Hono().basePath('/api');

app.get('/', (c) => {
  const body = { message: 'hello' };
  const statusCode = 200;
  const headers = {};

  return c.json(body, statusCode, headers);
});

// export default app;
export default {
  port: 3001, // default port is 3000
  fetch: app.fetch,
};
