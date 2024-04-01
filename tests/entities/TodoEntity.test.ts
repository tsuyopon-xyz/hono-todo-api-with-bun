import { describe, expect, it } from 'bun:test';
import TodoEntity from '@src/entities/TodoEntity';

describe('src/entities/TodoEntity.ts', () => {
  describe('成功パターン', () => {
    describe('constructor', () => {
      it('正しい引数を与えると例外は発生しない', async () => {
        const entity = new TodoEntity({ title: 'hello', body: 'world' });
        expect(entity.title).toEqual('hello');
        expect(entity.body).toEqual('world');
      });
    });
  });

  describe('異常パターン', () => {
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
});
