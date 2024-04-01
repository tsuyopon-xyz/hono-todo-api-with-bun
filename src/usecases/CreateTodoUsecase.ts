import TodoEntity from '@src/entities/TodoEntity';
import type IUsecase from './IUsecase';
import type IRepository from '@src/datasources/IRepository';

export type CreateTodoInputType = {
  title: string;
  body: string;
};

export default class CreateTodoUseCase
  implements IUsecase<CreateTodoInputType, TodoEntity>
{
  private readonly repository: IRepository<TodoEntity>;

  constructor(repository: IRepository<TodoEntity>) {
    this.repository = repository;
  }

  execute(input: CreateTodoInputType): TodoEntity {
    const entity = new TodoEntity({ title: input.title, body: input.body });
    const savedEntity = this.repository.save(entity);

    return savedEntity;
  }
}
