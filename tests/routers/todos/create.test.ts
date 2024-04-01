import { describe, expect, it, spyOn } from 'bun:test';
import { addRouteForCreateTodo } from '@src/routers/todos/create';
import type IUsecase from '@src/usecases/IUsecase';
import type { CreateTodoInputType } from '@src/usecases/CreateTodoUsecase';
import TodoEntity from '@src/entities/TodoEntity';
import CreateTodoController from '@src/controllers/todo/CreateTodoController';
import { streamToParsedJson } from '../../helpers/response';
import { Hono } from 'hono';

class MockUsecase implements IUsecase<CreateTodoInputType, TodoEntity> {
  execute(input: CreateTodoInputType): TodoEntity {
    return new TodoEntity({ id: 1, ...input });
  }
}

describe('src/routers/TodoRouter.ts', () => {
  it('should return json and status 201.', async () => {
    const usecase = new MockUsecase();
    const spy = spyOn(usecase, 'execute');
    const controller = new CreateTodoController(usecase);
    const app = new Hono();
    addRouteForCreateTodo({
      todoRouter: app,
      createTodoController: controller,
    });

    const req = new Request('http://localhost/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'foo', body: 'bar' }),
    });
    const res = await app.fetch(req);

    if (!res.body) {
      throw new Error('res.body must be ReadableStream');
    }
    const body = await streamToParsedJson(res.body);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(201);
    expect(body).toEqual({ id: 1, title: 'foo', body: 'bar' });
  });
});
