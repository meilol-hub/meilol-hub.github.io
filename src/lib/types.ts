export type Room = {
  id: string;
  name: string;
  nameEn: string;
  note?: string;
};

export type Artwork = {
  /** URL の #work=<id> に使う識別子（英数字とハイフン推奨） */
  id: string;
  /** public/images/ 内のファイル名 */
  file: string;
  /** 元画像のピクセル寸法（npm run add-images が自動で入れます） */
  width: number;
  height: number;
  title: string;
  titleEn?: string;
  /** 展示室の id（rooms のどれか） */
  room: string;
  year: number;
  medium: string;
  description?: string;
  tags?: string[];
  /** 壁に掛けたときの大きさの倍率。1 が標準、0.8〜1.2 くらいで変化がつきます */
  scale?: number;
  /** true にすると入口（トップ）に大きく展示されます */
  featured?: boolean;
};

export type Collection = {
  rooms: Room[];
  works: Artwork[];
};

/** 収蔵番号つきの作品（JSON の並び順で 1 から採番） */
export type Work = Artwork & { no: number };
