import { describe, expect, it, spyOn } from 'bun:test';
import TodoEntity from '@src/entities/TodoEntity';
import type { CreateTodoInputType } from '@src/usecases/CreateTodoUsecase';
import type IUsecase from '@src/usecases/IUsecase';
import CreateTodoController from '@src/controllers/todo/CreateTodoController';

class MockUsecase implements IUsecase<CreateTodoInputType, TodoEntity> {
  async execute(input: CreateTodoInputType) {
    return await new TodoEntity(input);
  }
}

describe('src/controllers/todo/CreateTodoController.ts', () => {
  describe('成功パターン', () => {
    describe('execute', () => {
      it('id付きのTodoEntityを返す', async () => {
        const usecase = new MockUsecase();
        const spy = spyOn(usecase, 'execute');
        const controller = new CreateTodoController(usecase);

        const result = await controller.handle({
          title: 'hello',
          body: 'world',
        });
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0]).toEqual([{ title: 'hello', body: 'world' }]);
        expect(result).toBeInstanceOf(TodoEntity);
      });
    });
  });
});