import { describe, expect, it } from 'bun:test';
import app from '@src/index';

const streamToParsedJson = async (rs: ReadableStream) => {
  // ReadableStreamのreaderを取得
  const reader = rs.getReader();
  let chunks = ''; // データを格納する変数

  // ストリームからデータを読み出す
  while (true) {
    const { done, value } = await reader.read();
    if (done) break; // ストリームの終わりに到達したらループを抜ける
    chunks += new TextDecoder().decode(value);
  }

  // JSONとしてパース
  return JSON.parse(chunks);
};

describe('src/index.ts', () => {
  it('should return json and status 200.', async () => {
    const req = new Request('http://localhost/api');
    const res = await app.fetch(req);

    if (!res.body) {
      throw new Error('res.body must be ReadableStream');
    }
    const body = await streamToParsedJson(res.body);

    expect(res.status).toBe(200);
    expect(body).toEqual({ message: 'hello' });
  });
});
