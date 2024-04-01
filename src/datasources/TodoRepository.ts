import TodoEntity from '@src/entities/TodoEntity';
import type IRepository from './IRepository';

// 一旦は配列をDBとする。
// 必要に応じて実際のDBを使ったり、ORMを使うような実装に修正する
let nextId = 1;
const db = [];

export default class TodoRepository implements IRepository<TodoEntity> {
  save(entity: TodoEntity): TodoEntity {
    if (entity.id !== undefined) {
      throw new Error('既にidを持っているため新規作成できません');
    }

    const entityToSave = new TodoEntity({
      id: nextId++,
      title: entity.title,
      body: entity.body,
    });
    db.push(entityToSave);

    return entityToSave;
  }
}
