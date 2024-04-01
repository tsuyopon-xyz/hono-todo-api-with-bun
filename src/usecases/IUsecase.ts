type UseCaseResponse<T> = T;

export default interface IUsecase<T> {
  execute(): UseCaseResponse<T>;
}
