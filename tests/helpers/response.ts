export const streamToParsedJson = async (rs: ReadableStream) => {
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
