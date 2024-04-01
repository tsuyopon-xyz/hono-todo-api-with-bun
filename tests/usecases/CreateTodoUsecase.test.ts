import { describe, expect, it, spyOn } from 'bun:test';
import TodoEntity from '@src/entities/TodoEntity';
import CreateTodoUseCase from '@src/usecases/CreateTodoUsecase';
import type IRepository from '@src/datasources/IRepository';

class MockRepository implements IRepository<TodoEntity> {
  private nextId: number;

  constructor() {
    this.nextId = 1;
  }

  save(entity: TodoEntity): TodoEntity {
    const e = new TodoEntity({
      id: this.nextId,
      title: entity.title,
      body: entity.body,
    });

    return e;
  }
}

describe('src/usecases/CreateTodoUsecase.ts', () => {
  describe('成功パターン', () => {
    describe('execute', () => {
      it('id付きのTodoEntityを返す', async () => {
        const repository = new MockRepository();
        const spy = spyOn(repository, 'save');
        const usecase = new CreateTodoUseCase(repository);
        const result = usecase.execute({
          title: 'hello',
          body: 'wolrd',
        });
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result.id).toEqual(1);
      });
    });
  });
});
