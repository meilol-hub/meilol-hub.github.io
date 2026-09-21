// GitHub Pages のプロジェクトサイトでは、public/ 内のファイルにも
// basePath を付ける必要があります。<img src> などはこの関数を通します。
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string) => `${BASE_PATH}${path}`;

const stem = (file: string) => file.replace(/\.[^.]+$/, "");

/** 一覧用の軽いサムネイル（npm run add-images が作る） */
export const thumbUrl = (file: string) =>
  asset(`/thumbs/${encodeURIComponent(stem(file))}.webp`);

/** 拡大表示・ダウンロード用の元画像 */
export const originalUrl = (file: string) =>
  asset(`/images/${encodeURIComponent(file)}`);
