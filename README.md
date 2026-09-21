# 余白館 / Yohaku Gallery

画像を展示する、小さなオンライン美術館。
Next.js 16 + HeroUI v3 + Tailwind CSS v4 で作った静的サイトで、GitHub Pages にそのまま公開できます。

- 暗い壁に額縁とマットで作品を掛ける、美術館風のデザイン（「照明」スイッチで昼の展示室にも切り替え）
- 展示室（カテゴリ）での絞り込み / 検索 / 並び替え / お気に入り / ランダム鑑賞
- 作品を大きく見る鑑賞室（← → キーで前後移動、実寸表示、画像保存、共有リンク）
- サーバー不要。`npm run build` で `out/` に静的ファイルができます

サンプルの 12 点は、このプロジェクト用にプログラムで生成した抽象画です。自由に削除・差し替えしてください。

---

## 1. ローカルで動かす

Node.js 20.9 以上が必要です（22 推奨）。

```bash
npm install
npm run dev        # http://localhost:3000 で確認
```

公開用のファイルを作って確認するとき:

```bash
npm run build      # out/ フォルダができる
npm run preview    # out/ をローカルで表示
```

## 2. 作品を追加する

1. 画像を `public/images/` に入れます（jpg / png / webp / avif / gif）。
2. 次のコマンドを実行します。

   ```bash
   npm run add-images
   ```

   一覧用のサムネイル（`public/thumbs/`）が作られ、`src/data/artworks.json` に下書きが追記されます。
3. `src/data/artworks.json` を開いて、追加された作品のタイトルなどを書き換えます。

```jsonc
{
  "id": "wall-at-dawn",          // 共有リンク（#work=wall-at-dawn）に使う。英数字とハイフン推奨
  "file": "wall-at-dawn.jpg",    // public/images/ 内のファイル名
  "width": 1440, "height": 1800, // add-images が自動で入れる
  "title": "朝の壁",
  "titleEn": "Wall at Dawn",     // 省略可
  "room": "color",               // 展示室の id（同じファイルの rooms のどれか）
  "year": 2024,
  "medium": "デジタル・ペインティング",
  "description": "作品の説明文",   // 省略可
  "tags": ["青", "朝"],           // 省略可。検索の対象になる
  "scale": 1.05,                 // 省略可。壁に掛ける大きさの倍率（0.8〜1.2 くらい）
  "featured": true               // true の作品が入口に大きく展示される（1 点だけ）
}
```

- 展示室（カテゴリ）を増やすときは、同じファイルの `rooms` に `{ "id", "name", "nameEn", "note" }` を足します。
- 作品の並び順が「収蔵順」になり、収蔵番号もこの順で採番されます。
- 画像を差し替えたあとでサムネイルを作り直すには `npm run add-images -- --force`。

> **注意**: `public/images/` の画像は加工されずにそのまま公開・ダウンロードできます。
> スマホで撮った写真などは位置情報（EXIF）が残っていることがあるので、気になる場合は削除してから入れてください。
> 一覧用サムネイルからはメタデータが取り除かれます。

## 3. 名前や色を変える

| 変えたいこと | 場所 |
| --- | --- |
| サイト名・キャッチコピー・フッターの GitHub リンク | `src/config/site.ts` |
| 壁・額縁・真鍮色など全体の配色 | `src/app/globals.css` の先頭にある `:root.dark` / `:root.light` |
| 額縁やマットの太さ、作品の基準の高さ | 同じく `globals.css` 先頭の `--mat-w` `--frame-w` `--row-h` |
| 既定を「昼の展示室」にしたい | `src/app/layout.tsx` の `lightsScript` と `<html className="dark">` を `light` 基準に変更 |

## 4. GitHub Pages で公開する

### 公開 URL の決まり方

| リポジトリ名 | 公開 URL |
| --- | --- |
| `<ユーザー名>.github.io` | `https://<ユーザー名>.github.io/` |
| それ以外（例: `yohaku`） | `https://<ユーザー名>.github.io/yohaku/` |

どちらの場合も設定の変更は不要です。`.github/workflows/deploy.yml` がリポジトリ名から自動で判断して、
`NEXT_PUBLIC_BASE_PATH` を設定します（`/リポジトリ名` 配下で公開される場合に、画像やスクリプトの場所がずれないようにするためです）。

### 手順

1. GitHub で新しいリポジトリを作ります（空のままで OK）。GitHub の無料プランで Pages を使うときは、リポジトリは **Public** にします。
2. このフォルダを push します。

   ```bash
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/meilol-hub/meilol-hub.github.io
   git push -u origin main
   ```

3. GitHub のリポジトリで **Settings → Pages** を開き、**Build and deployment → Source** を **GitHub Actions** にします。
4. **Actions** タブで「Deploy to GitHub Pages」が緑になるまで待ちます（初回は数分）。
   すでに push 済みで、Source を変えたあとに動いていない場合は、Actions タブから「Run workflow」で手動実行してください。
5. **Settings → Pages** の上部に公開 URL が表示されます。

以後は `main` に push するたびに自動で更新されます。作品を追加したら、画像と `artworks.json`（と `public/thumbs/`）を commit して push するだけです。

### うまくいかないとき

- **CSS や画像が出ない / 真っ白**: 公開 URL が `/<リポジトリ名>/` 配下なのに basePath なしでビルドされている可能性があります。
  `deploy.yml` の「Set base path」ステップが残っているか確認してください。
- **Actions が `Get Pages site failed` などで失敗する**: Settings → Pages の Source が「GitHub Actions」になっているか確認してください。
- **作品を追加したのにサムネイルが出ない**: `npm run add-images` を実行して、`public/thumbs/` の中身も commit しましたか？
- **workflow の警告（Node のバージョンなど）**: `deploy.yml` 内の `actions/*` のバージョンを最新のものに上げてください。

## 5. フォルダ構成

```
├─ .github/workflows/deploy.yml   GitHub Pages への自動公開
├─ public/
│  ├─ images/                     元画像（拡大表示・保存用）
│  └─ thumbs/                     一覧用サムネイル（add-images が作る）
├─ scripts/add-images.mjs         サムネイル作成 + artworks.json の下書き追記
└─ src/
   ├─ app/                        layout / page / 404 / globals.css（デザインの本体）
   ├─ components/                 Hero, Toolbar, WorkCard, Viewer(鑑賞室) など
   ├─ config/site.ts              サイト名・文言
   ├─ data/artworks.json          作品データ
   └─ lib/                        型、パス補助、お気に入り保存
```

フォントは npm パッケージ（`@fontsource`）から配信しており、ビルド時・閲覧時に外部の Google Fonts へは接続しません。
