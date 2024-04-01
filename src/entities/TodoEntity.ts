type TodoType = {
  title: string;
  body: string;
};

class TodoEntity {
  public readonly title: string;
  public readonly body: string;

  constructor({ title, body }: TodoType) {
    if (!title) throw new Error('`title`は必要です');
    if (!body) throw new Error('`body`は必要です');

    this.title = title;
    this.body = body;
  }
}

export default TodoEntity;
