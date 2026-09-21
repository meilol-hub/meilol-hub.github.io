import type { Work } from "@/lib/types";

type Props = {
  work: Work;
  src: string;
  /** 指定すると押せる額縁（ボタン）になる */
  onOpen?: () => void;
  eager?: boolean;
};

/** 額縁 + マット + 作品。大きさは親の .hung（--h と --ar）で決まる */
export function Frame({ work, src, onOpen, eager }: Props) {
  const picture = (
    <span className="mat">
      <img
        src={src}
        alt={work.titleEn ? `${work.title}（${work.titleEn}）` : work.title}
        width={work.width}
        height={work.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    </span>
  );

  if (!onOpen) return <div className="frame">{picture}</div>;

  return (
    <button
      type="button"
      className="frame frame-btn"
      onClick={onOpen}
      aria-label={`${work.title}を拡大して見る`}
    >
      {picture}
    </button>
  );
}
