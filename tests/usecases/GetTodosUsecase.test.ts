import { describe, expect, it, spyOn } from 'bun:test';
import TodoEntity from '@src/entities/TodoEntity';
import CreateTodoUseCase from '@src/usecases/CreateTodoUsecase';
import type IRepository from '@src/datasources/IRepository';
import GetTodosUsecase from '@src/usecases/GetTodosUsecase';

class MockRepository implements IRepository<TodoEntity> {
  private nextId: number;

  constructor() {
    this.nextId = 1;
  }

  async list({
    page: _1,
    limit: _2,
  }: { page: number; limit: number }): Promise<TodoEntity[]> {
    // saveメソッドだけモックできれば良いため、listのモック実装は不要
    return [new TodoEntity({ id: 1, title: 'mock_title', body: 'mock_body' })];
  }

  async save(entity: TodoEntity): Promise<TodoEntity> {
    // saveメソッドだけモックできれば良いため、listのモック実装は不要
    throw new Error('Method not implemented.');
  }
}

describe('src/usecases/GetTodosUsecase.ts', () => {
  describe('成功パターン', () => {
    describe('execute', () => {
      it('id付きのTodoEntityを返す', async () => {
        const repository = new MockRepository();
        const spy = spyOn(repository, 'list');
        const usecase = new GetTodosUsecase(repository);
        const result = await usecase.execute({
          page: 1,
          limit: 2,
        });
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0]).toEqual([{ page: 1, limit: 2 }]);
        expect(result).toEqual([
          new TodoEntity({ id: 1, title: 'mock_title', body: 'mock_body' }),
        ]);
      });
    });
  });
});
