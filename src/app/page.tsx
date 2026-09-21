import data from "@/data/artworks.json";
import type { Collection, Work } from "@/lib/types";
import { GalleryApp } from "@/components/GalleryApp";

export default function Page() {
  const { rooms, works } = data as Collection;
  // JSON の並び順がそのまま収蔵番号になる
  const numbered: Work[] = works.map((w, i) => ({ ...w, no: i + 1 }));
  return <GalleryApp rooms={rooms} works={numbered} />;
}
