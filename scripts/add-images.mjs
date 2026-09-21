// 使い方:
//   1. public/images/ に画像を入れる
//   2. npm run add-images
//
// やること:
//   ・一覧表示用のサムネイルを public/thumbs/ に作る（WebP・幅 960px）
//   ・src/data/artworks.json に、まだ登録されていない画像の下書きを追記する
//   ・登録済み作品の画像サイズ（width / height）を最新にそろえる
//
// 追記された作品の title / year / medium / description は、JSON を開いて書き換えてください。
// サムネイルを作り直したいときは:  npm run add-images -- --force

import { readdir, readFile, writeFile, mkdir, access, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const IMG_DIR = path.join(ROOT, "public", "images");
const THUMB_DIR = path.join(ROOT, "public", "thumbs");
const DATA_FILE = path.join(ROOT, "src", "data", "artworks.json");
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)$/i;
const THUMB_WIDTH = 960;
const FORCE = process.argv.includes("--force");

const exists = (p) => access(p).then(() => true, () => false);

const slugify = (name) =>
  name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function main() {
  await mkdir(IMG_DIR, { recursive: true });
  await mkdir(THUMB_DIR, { recursive: true });

  const data = JSON.parse(await readFile(DATA_FILE, "utf8"));
  const files = (await readdir(IMG_DIR)).filter((f) => IMAGE_EXT.test(f)).sort();

  const byFile = new Map(data.works.map((w) => [w.file, w]));
  const usedIds = new Set(data.works.map((w) => w.id));
  const added = [];
  let thumbs = 0;

  for (const file of files) {
    const src = path.join(IMG_DIR, file);
    const name = path.parse(file).name;
    const thumb = path.join(THUMB_DIR, `${name}.webp`);

    // 向き（EXIF）を反映した実寸を取る
    const meta = await sharp(src).metadata();
    const rotated = (meta.orientation ?? 1) >= 5;
    const width = rotated ? meta.height : meta.width;
    const height = rotated ? meta.width : meta.height;

    if (FORCE || !(await exists(thumb))) {
      await sharp(src)
        .rotate()
        .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(thumb);
      thumbs++;
    }

    const known = byFile.get(file);
    if (known) {
      known.width = width;
      known.height = height;
      continue;
    }

    let id = slugify(name) || `work-${data.works.length + added.length + 1}`;
    while (usedIds.has(id)) id += "-2";
    usedIds.add(id);

    const { mtime } = await stat(src);
    added.push({
      id,
      file,
      width,
      height,
      title: name,
      titleEn: "",
      room: data.rooms[0]?.id ?? "",
      year: mtime.getFullYear(),
      medium: "",
      description: "",
      tags: [],
    });
  }

  data.works.push(...added);

  const missing = data.works.filter((w) => !files.includes(w.file));

  await writeFile(DATA_FILE, JSON.stringify(data, null, 2) + "\n");

  console.log(`画像 ${files.length} 枚を確認しました。`);
  console.log(`  サムネイルを作成: ${thumbs} 枚`);
  console.log(`  作品を新規登録:   ${added.length} 点`);
  for (const w of added) console.log(`    + ${w.file}  (id: ${w.id})`);
  if (added.length) {
    console.log("\nsrc/data/artworks.json を開いて、追加された作品のタイトル・展示室・年などを書き換えてください。");
  }
  if (missing.length) {
    console.log("\n⚠ JSON に載っているのに画像が見つからない作品があります:");
    for (const w of missing) console.log(`    - ${w.file}  (id: ${w.id})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
