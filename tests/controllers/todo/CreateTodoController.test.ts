import { describe, expect, it, spyOn } from 'bun:test';
import TodoEntity from '@src/entities/TodoEntity';
import type { CreateTodoInputType } from '@src/usecases/CreateTodoUsecase';
import type IUsecase from '@src/usecases/IUsecase';
import CreateTodoController from '@src/controllers/todo/CreateTodoController';

class MockUsecase implements IUsecase<CreateTodoInputType, TodoEntity> {
  execute(input: CreateTodoInputType): TodoEntity {
    return new TodoEntity(input);
  }
}

describe('src/controllers/todo/CreateTodoController.ts', () => {
  describe('成功パターン', () => {
    describe('execute', () => {
      it('id付きのTodoEntityを返す', async () => {
        const usecase = new MockUsecase();
        const spy = spyOn(usecase, 'execute');
        const controller = new CreateTodoController(usecase);

        const result = controller.handle({
          title: 'hello',
          body: 'wolrd',
        });
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toBeInstanceOf(TodoEntity);
      });
    });
  });
});
