"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/react";
import type { Room, Work } from "@/lib/types";
import { useFavorites } from "@/lib/useFavorites";
import { Hero } from "./Hero";
import { Toolbar, type SortKey } from "./Toolbar";
import { WorkCard } from "./WorkCard";
import { Viewer } from "./Viewer";

const norm = (s: string) => s.normalize("NFKC").toLowerCase();

const SORTERS: Record<SortKey, (a: Work, b: Work) => number> = {
  order: (a, b) => a.no - b.no,
  new: (a, b) => b.year - a.year || a.no - b.no,
  old: (a, b) => a.year - b.year || a.no - b.no,
};

const HASH = /^#work=(.+)$/;

export function GalleryApp({ rooms, works }: { rooms: Room[]; works: Work[] }) {
  const [query, setQuery] = useState("");
  const [room, setRoom] = useState("all");
  const [sort, setSort] = useState<SortKey>("order");
  const [onlyFav, setOnlyFav] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const favs = useFavorites();

  const featured = works.find((w) => w.featured) ?? works[0];

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const w of works) c[w.room] = (c[w.room] ?? 0) + 1;
    return c;
  }, [works]);

  const roomName = useMemo(
    () => new Map(rooms.map((r) => [r.id, r.name])),
    [rooms],
  );

  const filtered = useMemo(() => {
    const terms = norm(query).split(/\s+/).filter(Boolean);
    return works
      .filter((w) => room === "all" || w.room === room)
      .filter((w) => !onlyFav || favs.has(w.id))
      .filter((w) => {
        if (!terms.length) return true;
        const hay = norm(
          [
            w.title,
            w.titleEn,
            w.description,
            w.medium,
            String(w.year),
            roomName.get(w.room),
            ...(w.tags ?? []),
          ]
            .filter(Boolean)
            .join(" "),
        );
        return terms.every((t) => hay.includes(t));
      })
      .sort(SORTERS[sort]);
  }, [works, room, onlyFav, favs, query, sort, roomName]);

  // 鑑賞室で前後に送る順番。フィルタ外の作品を開いていたら全体の順に切り替える
  const navList = useMemo(
    () =>
      openId && !filtered.some((w) => w.id === openId)
        ? [...works].sort(SORTERS[sort])
        : filtered,
    [openId, filtered, works, sort],
  );

  const open = useCallback((id: string) => {
    setOpenId(id);
    history.replaceState(null, "", `#work=${encodeURIComponent(id)}`);
  }, []);

  const close = useCallback(() => {
    setOpenId(null);
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }, []);

  // 共有リンク（#work=作品ID）で開かれたら、その作品を鑑賞室で表示する
  useEffect(() => {
    const fromHash = () => {
      const m = window.location.hash.match(HASH);
      if (!m) return;
      const id = decodeURIComponent(m[1]);
      if (works.some((w) => w.id === id)) setOpenId(id);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [works]);

  const random = () => {
    const pool = filtered.length ? filtered : works;
    open(pool[Math.floor(Math.random() * pool.length)].id);
  };

  const reset = () => {
    setQuery("");
    setRoom("all");
    setOnlyFav(false);
  };

  const currentRoom = rooms.find((r) => r.id === room);
  const status = query.trim()
    ? `「${query.trim()}」の検索結果 ${filtered.length}点`
    : currentRoom
      ? `${currentRoom.name}に${filtered.length}点を展示中`
      : `${filtered.length}点を展示中`;

  const openWork = openId ? (works.find((w) => w.id === openId) ?? null) : null;

  return (
    <>
      <Hero work={featured} onOpen={open} />

      <section id="gallery" className="shell gallery" aria-label="展示室">
        <Toolbar
          rooms={rooms}
          counts={counts}
          total={works.length}
          room={room}
          onRoom={setRoom}
          query={query}
          onQuery={setQuery}
          sort={sort}
          onSort={setSort}
          onlyFav={onlyFav}
          onOnlyFav={setOnlyFav}
          onRandom={random}
          status={status}
          note={
            !query.trim() && currentRoom?.note
              ? `${currentRoom.nameEn}　${currentRoom.note}`
              : undefined
          }
        />

        {filtered.length ? (
          <ul className="wall">
            {filtered.map((w, i) => (
              <WorkCard
                key={w.id}
                work={w}
                eager={i < 4}
                faved={favs.has(w.id)}
                onOpen={open}
                onToggleFav={favs.toggle}
              />
            ))}
          </ul>
        ) : (
          <div className="empty">
            <p className="empty-title">
              {onlyFav && !query.trim() && room === "all"
                ? "お気に入りの作品はまだありません"
                : "条件に合う作品がありません"}
            </p>
            <p className="empty-body">
              {onlyFav && !query.trim() && room === "all"
                ? "作品の下にあるハートを押すと、ここに集まります。"
                : "言葉や展示室を変えて、もう一度探してみてください。"}
            </p>
            <Button variant="secondary" onPress={reset}>
              条件をリセット
            </Button>
          </div>
        )}
      </section>

      <Viewer
        work={openWork}
        list={navList}
        rooms={rooms}
        faved={openWork ? favs.has(openWork.id) : false}
        onToggleFav={favs.toggle}
        onNavigate={open}
        onClose={close}
      />
    </>
  );
}
