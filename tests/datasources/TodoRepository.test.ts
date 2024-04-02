import { describe, expect, it } from 'bun:test';
import TodoEntity from '@src/entities/TodoEntity';
import TodoRepository from '@src/datasources/TodoRepository';

describe('src/datasources/TodoRepository.ts', () => {
  describe('成功パターン', () => {
    describe('save', () => {
      it('idが無いTodoEntityの場合、新規作成できる', async () => {
        const repository = new TodoRepository();
        const entity = new TodoEntity({ title: 'hello', body: 'world' });

        const savedEntity = await repository.save(entity);
        expect(savedEntity).toEqual(
          new TodoEntity({ id: 1, title: 'hello', body: 'world' }),
        );
      });
    });

    describe('list', () => {
      const todoEntities: TodoEntity[] = [];
      for (let i = 1; i <= 11; i++) {
        const entity = new TodoEntity({ title: `title${i}`, body: `body${i}` });
        todoEntities.push(entity);
      }

      it('page, limitの指定がない場合は、先頭から10件のデータを取得する', async () => {
        const repository = new TodoRepository(todoEntities);
        const entities = await repository.list();

        expect(entities.length).toEqual(10);
        expect(entities.map((e) => e.id)).toEqual([
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        ]);
        expect(entities[0].title).toEqual('title1');
        expect(entities[9].title).toEqual('title10');
      });

      it('page = 2だけ指定がある場合は、1件(11件目の)データだけを取得する', async () => {
        const repository = new TodoRepository(todoEntities);
        const entities = await repository.list({ page: 2 });

        expect(entities.length).toEqual(1);
      });

      it('page = 1, limit = 3を指定すると、先頭3件のデータを取得する', async () => {
        const repository = new TodoRepository(todoEntities);
        const entities = await repository.list({ page: 1, limit: 3 });

        expect(entities.length).toEqual(3);
        expect(entities.map((e) => e.id)).toEqual([1, 2, 3]);
      });

      it('page = 4, limit = 3を指定すると、最後2件(10件目と11件目)のデータを取得する', async () => {
        const repository = new TodoRepository(todoEntities);
        const entities = await repository.list({ page: 4, limit: 3 });

        expect(entities.length).toEqual(2);
        expect(entities.map((e) => e.id)).toEqual([10, 11]);
      });

      it('page = 2, limit = 11を指定すると、空配列を取得する(12件目のデータが存在しないため)', async () => {
        const repository = new TodoRepository(todoEntities);
        const entities = await repository.list({ page: 2, limit: 11 });

        expect(entities).toEqual([]);
      });
    });

    describe('find', () => {
      const todoEntities: TodoEntity[] = [
        new TodoEntity({ title: 'title', body: 'body' }),
      ];

      it('idに対応するデータがあれば、Entityを返す', async () => {
        const repository = new TodoRepository(todoEntities);
        const entity = await repository.find(1);

        expect(entity).toEqual(
          new TodoEntity({ id: 1, title: 'title', body: 'body' }),
        );
      });

      it('idに対応するデータがない場合は、nullを返す', async () => {
        const repository = new TodoRepository(todoEntities);
        const entity = await repository.find(2);

        expect(entity).toBeNull();
      });
    });
  });

  describe('異常パターン', () => {
    describe('save', () => {
      it('idが既にあるTodoEntityの場合、例外が発生する', async () => {
        const repository = new TodoRepository();
        const entity = new TodoEntity({ id: 1, title: 'hello', body: 'world' });

        expect(async () => await repository.save(entity)).toThrow(
          new Error('既にidを持っているため新規作成できません'),
        );
      });
    });

    describe('list', () => {
      it('pageが1未満の場合は例外が発生する', async () => {
        const repository = new TodoRepository();

        expect(async () => await repository.list({ page: 0 })).toThrow(
          new Error('pageは1以上の整数のみ'),
        );
      });

      it('pageが小数の場合は例外が発生する', async () => {
        const repository = new TodoRepository();

        expect(async () => await repository.list({ page: 1.1 })).toThrow(
          new Error('pageは1以上の整数のみ'),
        );
      });

      it('limitが1未満の場合は例外が発生する', async () => {
        const repository = new TodoRepository();

        expect(async () => await repository.list({ limit: 0 })).toThrow(
          new Error('limitは1以上の整数のみ'),
        );
      });

      it('limitが小数の場合は例外が発生する', async () => {
        const repository = new TodoRepository();

        expect(async () => await repository.list({ limit: 1.1 })).toThrow(
          new Error('limitは1以上の整数のみ'),
        );
      });
    });
  });
});
