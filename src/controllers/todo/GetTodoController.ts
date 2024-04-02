import type {
  GetTodoInputType,
  GetTodoOutputType,
} from '@src/usecases/GetTodoUsecase';
import type IUsecase from '@src/usecases/IUsecase';

export default class GetTodosController {
  private readonly usecase: IUsecase<GetTodoInputType, GetTodoOutputType>;

  constructor(usecase: IUsecase<GetTodoInputType, GetTodoOutputType>) {
    this.usecase = usecase;
  }

  handle(input: GetTodoInputType) {
    return this.usecase.execute(input);
  }
}
