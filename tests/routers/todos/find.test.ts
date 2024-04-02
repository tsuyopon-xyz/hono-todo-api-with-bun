import { describe, expect, it, spyOn } from 'bun:test';
import type IUsecase from '@src/usecases/IUsecase';
import TodoEntity from '@src/entities/TodoEntity';
import { streamToParsedJson } from '../../helpers/response';
import { Hono } from 'hono';
import type {
  GetTodoInputType,
  GetTodoOutputType,
} from '@src/usecases/GetTodoUsecase';
import GetTodoController from '@src/controllers/todo/GetTodoController';
import { addRouteForGetTodo } from '@src/routers/todos/find';

class MockUsecase implements IUsecase<GetTodoInputType, GetTodoOutputType> {
  async execute(input: GetTodoInputType) {
    if (input.id === 999) {
      return new TodoEntity({ id: input.id, title: 'foo', body: 'bar' });
    }

    return null;
  }
}

describe('src/routers/todos/find.ts', () => {
  const createAppAndSpy = () => {
    const usecase = new MockUsecase();
    const spy = spyOn(usecase, 'execute');
    const controller = new GetTodoController(usecase);
    const app = new Hono();
    addRouteForGetTodo({
      todoRouter: app,
      getTodoController: controller,
    });

    return { app, spy };
  };

  describe('成功パターン', () => {
    it('/:id に対応するTodoEntityを返す', async () => {
      const { app, spy } = createAppAndSpy();
      const req = new Request('http://localhost/999', {
        method: 'GET',
      });
      const res = await app.fetch(req);

      if (!res.body) {
        throw new Error('res.body must be ReadableStream');
      }
      const body = await streamToParsedJson(res.body);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0]).toEqual([{ id: 999 }]);
      expect(res.status).toEqual(200);
      expect(body).toEqual({
        id: 999,
        title: 'foo',
        body: 'bar',
      });
    });
  });

  describe('失敗パターン', () => {
    describe('main process', () => {
      it('/:id に対応するデータがない場合は404エラーを返す', async () => {
        const { app, spy } = createAppAndSpy();
        const req = new Request('http://localhost/1000', {
          method: 'GET',
        });
        const res = await app.fetch(req);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0]).toEqual([{ id: 1000 }]);
        expect(res.status).toEqual(404);

        if (!res.body) {
          throw new Error('res.body must be ReadableStream');
        }
        const body = await streamToParsedJson(res.body);
        expect(body).toEqual({
          error: 'Not Found',
        });
      });
    });

    describe('validator', () => {
      it('1未満は不正のため, 400エラーになる', async () => {
        const { app, spy } = createAppAndSpy();
        const req = new Request('http://localhost/0', {
          method: 'GET',
        });
        const res = await app.fetch(req);

        if (!res.body) {
          throw new Error('res.body must be ReadableStream');
        }
        const body = await streamToParsedJson(res.body);

        expect(spy).toHaveBeenCalledTimes(0);
        expect(res.status).toBe(400);
        expect(body).toHaveProperty('error');
      });

      it('小数は不正のため, 400エラーになる', async () => {
        const { app, spy } = createAppAndSpy();
        const req = new Request('http://localhost/1.1', {
          method: 'GET',
        });
        const res = await app.fetch(req);

        if (!res.body) {
          throw new Error('res.body must be ReadableStream');
        }
        const body = await streamToParsedJson(res.body);

        expect(spy).toHaveBeenCalledTimes(0);
        expect(res.status).toBe(400);
        expect(body).toHaveProperty('error');
      });

      it('number以外は不正のため, 400エラーになる', async () => {
        const { app, spy } = createAppAndSpy();
        const req = new Request('http://localhost/invalid', {
          method: 'GET',
        });
        const res = await app.fetch(req);

        if (!res.body) {
          throw new Error('res.body must be ReadableStream');
        }
        const body = await streamToParsedJson(res.body);

        expect(spy).toHaveBeenCalledTimes(0);
        expect(res.status).toBe(400);
        expect(body).toHaveProperty('error');
      });
    });
  });
});
