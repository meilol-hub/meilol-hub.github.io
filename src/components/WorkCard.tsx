import type { CSSProperties } from "react";
import { Button } from "@heroui/react";
import type { Work } from "@/lib/types";
import { thumbUrl } from "@/lib/path";
import { Frame } from "./Frame";
import { HeartIcon } from "./icons";

type Props = {
  work: Work;
  faved: boolean;
  eager?: boolean;
  onOpen: (id: string) => void;
  onToggleFav: (id: string) => void;
};

/** 壁に掛かった 1 点。下に美術館のキャプションを添える */
export function WorkCard({ work, faved, eager, onOpen, onToggleFav }: Props) {
  const style = {
    "--ar": work.width / work.height,
    "--h": `calc(var(--row-h) * ${work.scale ?? 1})`,
  } as CSSProperties;

  return (
    <li className="work hung" style={style}>
      <Frame
        work={work}
        src={thumbUrl(work.file)}
        eager={eager}
        onOpen={() => onOpen(work.id)}
      />
      <div className="cap">
        <div className="cap-text">
          <p className="cap-title">{work.title}</p>
          {work.titleEn ? <p className="cap-en">{work.titleEn}</p> : null}
          <p className="cap-meta">
            {work.year}年
            {work.medium ? `　${work.medium}` : ""}
          </p>
        </div>
        <Button
          isIconOnly
          size="sm"
          variant="ghost"
          className="fav"
          aria-pressed={faved}
          aria-label={
            faved
              ? `${work.title}をお気に入りから外す`
              : `${work.title}をお気に入りに追加`
          }
          onPress={() => onToggleFav(work.id)}
        >
          <HeartIcon filled={faved} />
        </Button>
      </div>
    </li>
  );
}
