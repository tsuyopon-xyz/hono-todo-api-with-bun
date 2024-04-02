import { describe, expect, it } from 'bun:test';
import TodoEntity from '@src/entities/TodoEntity';

describe('src/entities/TodoEntity.ts', () => {
  describe('成功パターン', () => {
    describe('constructor', () => {
      describe('id無しの場合', () => {
        it('[id無し]正しい引数を与えると例外は発生しない', async () => {
          const entity = new TodoEntity({ title: 'hello', body: 'world' });
          expect(entity.id).toBeUndefined();
          expect(entity.title).toEqual('hello');
          expect(entity.body).toEqual('world');
        });
      });

      describe('idありの場合', () => {
        it('[整数]正しい引数を与えると例外は発生しないその1', async () => {
          const entity = new TodoEntity({
            id: 1,
            title: 'hello',
            body: 'world',
          });
          expect(entity.id).toEqual(1);
          expect(entity.title).toEqual('hello');
          expect(entity.body).toEqual('world');
        });

        it('[小数だけど実質整数]正しい引数を与えると例外は発生しないその2', async () => {
          const entity = new TodoEntity({
            id: 1.0,
            title: 'hello',
            body: 'world',
          });
          expect(entity.id).toEqual(1);
          expect(entity.title).toEqual('hello');
          expect(entity.body).toEqual('world');
        });
      });
    });
  });

  describe('異常パターン', () => {
    describe('constructor', () => {
      describe('id無しの場合', () => {
        it('titleがない場合例外を発生する', async () => {
          expect(() => new TodoEntity({ title: '', body: 'aiu' })).toThrow(
            new Error('`title`は必要です'),
          );
        });

        it('bodyがない場合例外を発生する', async () => {
          expect(() => new TodoEntity({ title: 'aiu', body: '' })).toThrow(
            new Error('`body`は必要です'),
          );
        });
      });

      describe('idありの場合', () => {
        it('idが1未満のときは例外が発生する', async () => {
          expect(
            () => new TodoEntity({ id: 0, title: 'hello', body: 'world' }),
          ).toThrow(new Error('`id`が不正です'));
        });

        it('idが小数のときは例外が発生する', async () => {
          expect(
            () => new TodoEntity({ id: 1.1, title: 'hello', body: 'world' }),
          ).toThrow(new Error('`id`が不正です'));
        });
      });
    });
  });
});
