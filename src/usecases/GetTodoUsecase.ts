import type TodoEntity from '@src/entities/TodoEntity';
import type IUsecase from './IUsecase';
import type IRepository from '@src/datasources/IRepository';

export type GetTodoInputType = {
  id: number;
};

export type GetTodoOutputType = TodoEntity | null;

export default class GetTodoUsecase
  implements IUsecase<GetTodoInputType, GetTodoOutputType>
{
  private readonly repository: IRepository<TodoEntity>;

  constructor(repository: IRepository<TodoEntity>) {
    this.repository = repository;
  }

  async execute(input: GetTodoInputType) {
    return await this.repository.find(input.id);
  }
}
