import { describe, expect, it, spyOn } from 'bun:test';
import type IUsecase from '@src/usecases/IUsecase';
import TodoEntity from '@src/entities/TodoEntity';
import { streamToParsedJson } from '../../helpers/response';
import { Hono } from 'hono';
import type { GetTodosInputType } from '@src/usecases/GetTodosUsecase';
import GetTodosController from '@src/controllers/todo/GetTodosController';
import { addRouteForGetTodos } from '@src/routers/todos/list';

class MockUsecase implements IUsecase<GetTodosInputType, TodoEntity[]> {
  async execute(_: GetTodosInputType) {
    return [new TodoEntity({ id: 1, title: 'foo', body: 'bar' })];
  }
}

describe('src/routers/todos/list.ts', () => {
  describe('成功パターン', () => {
    it('クエリパラメータ無しでリクエストを受け取ると、page: 1, limit: 10でデータを取得する', async () => {
      const usecase = new MockUsecase();
      const spy = spyOn(usecase, 'execute');
      const controller = new GetTodosController(usecase);
      const app = new Hono();
      addRouteForGetTodos({
        todoRouter: app,
        getTodosController: controller,
      });

      const req = new Request('http://localhost/', {
        method: 'GET',
      });
      const res = await app.fetch(req);

      if (!res.body) {
        throw new Error('res.body must be ReadableStream');
      }
      const body = await streamToParsedJson(res.body);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0]).toEqual([{ page: 1, limit: 10 }]);
      expect(res.status).toBe(200);
      expect(body).toEqual([
        {
          id: 1,
          title: 'foo',
          body: 'bar',
        },
      ]);
    });

    it('クエリパラメータ有りでリクエストを受け取ると、usecaseにクエリパラメータ値を渡す', async () => {
      const usecase = new MockUsecase();
      const spy = spyOn(usecase, 'execute');
      const controller = new GetTodosController(usecase);
      const app = new Hono();
      addRouteForGetTodos({
        todoRouter: app,
        getTodosController: controller,
      });

      const req = new Request('http://localhost/?page=2&limit=3', {
        method: 'GET',
      });
      const res = await app.fetch(req);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0]).toEqual([{ page: 2, limit: 3 }]);
      expect(res.status).toBe(200);
    });
  });

  describe('失敗パターン', () => {
    describe('validator', () => {
      it('クエリパラメータが不正の場合, 400エラーになる', async () => {
        const usecase = new MockUsecase();
        const spy = spyOn(usecase, 'execute');
        const controller = new GetTodosController(usecase);
        const app = new Hono();
        addRouteForGetTodos({
          todoRouter: app,
          getTodosController: controller,
        });

        const req = new Request('http://localhost/?page=2.2', {
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

      it('クエリパラメータが不正の場合, 400エラーになる', async () => {
        const usecase = new MockUsecase();
        const spy = spyOn(usecase, 'execute');
        const controller = new GetTodosController(usecase);
        const app = new Hono();
        addRouteForGetTodos({
          todoRouter: app,
          getTodosController: controller,
        });

        const req = new Request('http://localhost/?page=fuga&limit=1.2', {
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
        expect(body.error.issues.length).toEqual(2);
      });
    });
  });
});
