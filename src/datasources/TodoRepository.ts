import TodoEntity from '@src/entities/TodoEntity';
import type IRepository from './IRepository';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export default class TodoRepository implements IRepository<TodoEntity> {
  // 一旦は配列をDBとする。
  // 必要に応じて実際のDBを使ったり、ORMを使うような実装に修正する
  private nextId = 1;
  private db: TodoEntity[] = [];

  constructor(initialEntities: TodoEntity[] = []) {
    for (const entity of initialEntities) {
      this.save(entity);
    }
  }

  async save(entity: TodoEntity): Promise<TodoEntity> {
    if (entity.id !== undefined) {
      throw new Error('既にidを持っているため新規作成できません');
    }

    const entityToSave = new TodoEntity({
      id: this.nextId++,
      title: entity.title,
      body: entity.body,
    });
    this.db.push(entityToSave);

    return entityToSave;
  }

  async list(
    { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = {
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
    },
  ): Promise<TodoEntity[]> {
    if (page < 1 || !Number.isInteger(page)) {
      throw new Error('pageは1以上の整数のみ');
    }
    if (limit < 1 || !Number.isInteger(limit)) {
      throw new Error('limitは1以上の整数のみ');
    }

    const offset = (page - 1) * limit;

    return this.db.slice(offset, offset + limit);
  }
}
