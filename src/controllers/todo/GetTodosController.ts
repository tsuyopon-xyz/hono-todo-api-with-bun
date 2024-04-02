import type TodoEntity from '@src/entities/TodoEntity';
import type { GetTodosInputType } from '@src/usecases/GetTodosUsecase';
import type IUsecase from '@src/usecases/IUsecase';

export default class GetTodosController {
  private readonly usecase: IUsecase<GetTodosInputType, TodoEntity[]>;

  constructor(usecase: IUsecase<GetTodosInputType, TodoEntity[]>) {
    this.usecase = usecase;
  }

  handle(input: GetTodosInputType) {
    return this.usecase.execute(input);
  }
}
