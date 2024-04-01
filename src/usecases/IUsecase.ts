type UseCaseInput<T> = T;
type UseCaseResponse<U> = U;

export default interface IUsecase<Input, Output> {
  execute(input: UseCaseInput<Input>): UseCaseResponse<Output>;
}
