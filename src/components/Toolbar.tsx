"use client";

import {
  Button,
  ListBox,
  SearchField,
  Select,
  ToggleButton,
  ToggleButtonGroup,
} from "@heroui/react";
import type { Key } from "react";
import type { Room } from "@/lib/types";
import { HeartIcon, ShuffleIcon } from "./icons";

export type SortKey = "order" | "new" | "old";

const SORTS: { id: SortKey; label: string }[] = [
  { id: "order", label: "収蔵順" },
  { id: "new", label: "新しい順" },
  { id: "old", label: "古い順" },
];

type Props = {
  rooms: Room[];
  counts: Record<string, number>;
  total: number;
  room: string;
  onRoom: (id: string) => void;
  query: string;
  onQuery: (q: string) => void;
  sort: SortKey;
  onSort: (s: SortKey) => void;
  onlyFav: boolean;
  onOnlyFav: (v: boolean) => void;
  onRandom: () => void;
  status: string;
  note?: string;
};

export function Toolbar(p: Props) {
  return (
    <div className="controls">
      <ToggleButtonGroup
        aria-label="展示室"
        className="rooms"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={new Set([p.room])}
        onSelectionChange={(keys) => {
          const [first] = Array.from(keys);
          if (first != null) p.onRoom(String(first));
        }}
      >
        <ToggleButton id="all" className="room-btn">
          すべて<span className="count">{p.total}</span>
        </ToggleButton>
        {p.rooms.map((r) => (
          <ToggleButton key={r.id} id={r.id} className="room-btn">
            {r.name}
            <span className="count">{p.counts[r.id] ?? 0}</span>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <div className="tools">
        <SearchField
          className="search"
          aria-label="作品を探す"
          value={p.query}
          onChange={p.onQuery}
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="作品名・タグで探す" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <Select
          className="sort"
          aria-label="並び順"
          value={p.sort}
          onChange={(k: Key | null) => k && p.onSort(String(k) as SortKey)}
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {SORTS.map((s) => (
                <ListBox.Item key={s.id} id={s.id} textValue={s.label}>
                  {s.label}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <ToggleButton
          className="fav-filter"
          isSelected={p.onlyFav}
          onChange={p.onOnlyFav}
        >
          <HeartIcon filled={p.onlyFav} />
          お気に入りのみ
        </ToggleButton>

        <Button variant="ghost" className="random" onPress={p.onRandom}>
          <ShuffleIcon />
          ランダムに鑑賞
        </Button>
      </div>

      <p className="status" aria-live="polite">
        {p.status}
        {p.note ? <span className="note">{p.note}</span> : null}
      </p>
    </div>
  );
}
