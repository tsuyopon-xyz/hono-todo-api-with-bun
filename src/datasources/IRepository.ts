export default interface IRepository<T> {
  // 配列をDBとして擬似的に扱う場合は同期処理になるが、実際にDBとやり取りをする際は非同期処理となるため戻り値をPromiseにしている
  save(entity: T): Promise<T>;
  list({ page, limit }: { page: number; limit: number }): Promise<T[]>;
  find(id: number): Promise<T | null>;
}
