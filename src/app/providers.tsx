"use client";

import { I18nProvider } from "@heroui/react";
import type { ReactNode } from "react";

// React Aria（HeroUI の土台）が使う表示言語を日本語にそろえる。
// 検索欄の「クリア」ボタンなどの読み上げ文言が日本語になります。
export function Providers({ children }: { children: ReactNode }) {
  return <I18nProvider locale="ja-JP">{children}</I18nProvider>;
}
