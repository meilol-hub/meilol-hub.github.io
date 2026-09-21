import type { NextConfig } from "next";

// GitHub Pages のプロジェクトサイト（https://<user>.github.io/<repo>/）では
// サイトが /<repo> 配下に置かれるため、basePath が必要です。
// GitHub Actions が自動で設定するので、ローカルでは何も指定しなくて OK。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export", // 静的 HTML として書き出す（out/ ができる）
  basePath,
  trailingSlash: true,
  images: { unoptimized: true }, // 静的書き出しでは Next の画像最適化は使えない
};

export default nextConfig;
