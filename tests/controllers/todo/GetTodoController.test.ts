import { describe, expect, it, spyOn } from 'bun:test';
import TodoEntity from '@src/entities/TodoEntity';
import type IUsecase from '@src/usecases/IUsecase';
import type {
  GetTodoInputType,
  GetTodoOutputType,
} from '@src/usecases/GetTodoUsecase';
import GetTodoController from '@src/controllers/todo/GetTodoController';

class MockUsecase implements IUsecase<GetTodoInputType, GetTodoOutputType> {
  async execute(input: GetTodoInputType): Promise<GetTodoOutputType> {
    if (input.id === 999) {
      return new TodoEntity({ id: input.id, title: 'foo', body: 'bar' });
    }

    return null;
  }
}

describe('src/controllers/todo/CreateTodoController.ts', () => {
  describe('成功パターン', () => {
    describe('execute', () => {
      it('id対応したTodoEntityを返す', async () => {
        const usecase = new MockUsecase();
        const spy = spyOn(usecase, 'execute');
        const controller = new GetTodoController(usecase);
        const result = await controller.handle({ id: 999 });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0]).toEqual([{ id: 999 }]);
        expect(result).toEqual(
          new TodoEntity({ id: 999, title: 'foo', body: 'bar' }),
        );
      });

      it('id対応したデータがない場合はnullを返す', async () => {
        const usecase = new MockUsecase();
        const spy = spyOn(usecase, 'execute');
        const controller = new GetTodoController(usecase);
        const result = await controller.handle({ id: 1000 });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0]).toEqual([{ id: 1000 }]);
        expect(result).toBeNull();
      });
    });
  });
});
