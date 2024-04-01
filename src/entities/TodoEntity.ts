type TodoType = {
  id?: number;
  title: string;
  body: string;
};

class TodoEntity {
  public readonly title: string;
  public readonly body: string;
  public readonly id?: number;

  constructor({ id, title, body }: TodoType) {
    if (id !== undefined && (id < 1 || !Number.isInteger(id))) {
      throw new Error('`id`が不正です');
    }
    if (!title) {
      throw new Error('`title`は必要です');
    }
    if (!body) {
      throw new Error('`body`は必要です');
    }

    this.id = id ? Number(id) : undefined; // Number.isInteger(1.0)もtrueになるため、整数部分だけ抜き出している
    this.title = title;
    this.body = body;
  }
}

export default TodoEntity;
