import { describe, expect, it, spyOn } from 'bun:test';
import TodoEntity from '@src/entities/TodoEntity';
import type IRepository from '@src/datasources/IRepository';
import GetTodoUsecase, {
  type GetTodoOutputType,
} from '@src/usecases/GetTodoUsecase';

class MockRepository implements IRepository<TodoEntity> {
  private nextId: number;

  constructor() {
    this.nextId = 1;
  }

  async find(id: number): Promise<GetTodoOutputType> {
    if (id === 1) {
      return new TodoEntity({ id: 1, title: 'foo', body: 'bar' });
    }

    return null;
  }

  async list({
    page: _1,
    limit: _2,
  }: { page: number; limit: number }): Promise<TodoEntity[]> {
    throw new Error('Method not implemented.');
  }

  async save(_: TodoEntity): Promise<TodoEntity> {
    throw new Error('Method not implemented.');
  }
}

describe('src/usecases/GetTodoUsecase.ts', () => {
  describe('成功パターン', () => {
    describe('execute', () => {
      it('idに対応するデータが存在する場合、TodoEntityを1件返す', async () => {
        const repository = new MockRepository();
        const spy = spyOn(repository, 'find');
        const usecase = new GetTodoUsecase(repository);
        const result = await usecase.execute({ id: 1 });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0]).toEqual([1]);
        expect(result).toEqual(
          new TodoEntity({ id: 1, title: 'foo', body: 'bar' }),
        );
      });

      it('idに対応するデータが存在する場合、TodoEntityを1件返す', async () => {
        const repository = new MockRepository();
        const spy = spyOn(repository, 'find');
        const usecase = new GetTodoUsecase(repository);
        const result = await usecase.execute({ id: 2 });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0]).toEqual([2]);
        expect(result).toBeNull();
      });
    });
  });
});
