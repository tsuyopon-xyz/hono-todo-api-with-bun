import TodoEntity from '@src/entities/TodoEntity';
import type IUsecase from './IUsecase';
import type IRepository from '@src/datasources/IRepository';

type CreateTodoInputType = {
  title: string;
  body: string;
};

export default class CreateTodoUseCase implements IUsecase<TodoEntity> {
  private readonly entity: TodoEntity;
  private readonly repository: IRepository<TodoEntity>;

  constructor(
    repository: IRepository<TodoEntity>,
    { title, body }: CreateTodoInputType,
  ) {
    this.repository = repository;
    this.entity = new TodoEntity({ title, body });
  }

  execute(): TodoEntity {
    const savedEntity = this.repository.save(this.entity);

    return savedEntity;
  }
}
