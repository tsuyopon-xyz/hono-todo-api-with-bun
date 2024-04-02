import type TodoEntity from '@src/entities/TodoEntity';
import type IUsecase from './IUsecase';
import type IRepository from '@src/datasources/IRepository';

export type GetTodosInputType = {
  page: number;
  limit: number;
};

export default class GetTodosUsecase
  implements IUsecase<GetTodosInputType, TodoEntity[]>
{
  private readonly repository: IRepository<TodoEntity>;

  constructor(repository: IRepository<TodoEntity>) {
    this.repository = repository;
  }

  async execute(input: GetTodosInputType): Promise<TodoEntity[]> {
    return await this.repository.list(input);
  }
}
