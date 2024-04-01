import { describe, expect, it } from 'bun:test';
import TodoEntity from '@src/entities/TodoEntity';
import TodoRepository from '@src/datasources/TodoRepository';

describe('src/datasources/TodoRepository.ts', () => {
  describe('成功パターン', () => {
    describe('save', () => {
      it('idが無いTodoEntityの場合、新規作成できる', async () => {
        const repository = new TodoRepository();
        const entity = new TodoEntity({ title: 'hello', body: 'world' });

        const savedEntity = repository.save(entity);
        expect(savedEntity).toEqual(
          new TodoEntity({ id: 1, title: 'hello', body: 'world' }),
        );
      });
    });
  });

  describe('異常パターン', () => {
    describe('save', () => {
      it('idが既にあるTodoEntityの場合、例外が発生する', async () => {
        const repository = new TodoRepository();
        const entity = new TodoEntity({ id: 1, title: 'hello', body: 'world' });

        expect(() => repository.save(entity)).toThrow(
          new Error('既にidを持っているため新規作成できません'),
        );
      });
    });
  });
});
