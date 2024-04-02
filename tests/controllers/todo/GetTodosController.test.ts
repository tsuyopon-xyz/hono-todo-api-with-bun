import { describe, expect, it, spyOn } from 'bun:test';
import TodoEntity from '@src/entities/TodoEntity';
import type IUsecase from '@src/usecases/IUsecase';
import type { GetTodosInputType } from '@src/usecases/GetTodosUsecase';
import GetTodosController from '@src/controllers/todo/GetTodosController';

class MockUsecase implements IUsecase<GetTodosInputType, TodoEntity[]> {
  async execute(_: GetTodosInputType): Promise<TodoEntity[]> {
    return [new TodoEntity({ id: 1, title: 'foo', body: 'bar' })];
  }
}

describe('src/controllers/todo/CreateTodoController.ts', () => {
  describe('成功パターン', () => {
    describe('execute', () => {
      it('id付きのTodoEntityを返す', async () => {
        const usecase = new MockUsecase();
        const spy = spyOn(usecase, 'execute');
        const controller = new GetTodosController(usecase);

        const result = await controller.handle({
          page: 1,
          limit: 2,
        });
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0]).toEqual([{ page: 1, limit: 2 }]);
        expect(result).toEqual([
          new TodoEntity({ id: 1, title: 'foo', body: 'bar' }),
        ]);
      });
    });
  });
});
