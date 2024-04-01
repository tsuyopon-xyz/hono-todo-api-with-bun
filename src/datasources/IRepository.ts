export default interface IRepository<T> {
  save(entity: T): T;
}
