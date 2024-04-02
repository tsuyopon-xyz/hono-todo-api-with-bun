import type TodoEntity from '@src/entities/TodoEntity';
import type { CreateTodoInputType } from '@src/usecases/CreateTodoUsecase';
import type IUsecase from '@src/usecases/IUsecase';

export default class CreateTodoController {
  private readonly usecase: IUsecase<CreateTodoInputType, TodoEntity>;

  constructor(usecase: IUsecase<CreateTodoInputType, TodoEntity>) {
    this.usecase = usecase;
  }

  async handle(input: CreateTodoInputType) {
    return await this.usecase.execute(input);
  }
}
