"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import {
  Button,
  Chip,
  Modal,
  Tooltip,
  buttonVariants,
} from "@heroui/react";
import type { Room, Work } from "@/lib/types";
import { originalUrl, thumbUrl } from "@/lib/path";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  HeartIcon,
  LinkIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "./icons";

type Props = {
  work: Work | null;
  list: Work[];
  rooms: Room[];
  faved: boolean;
  onToggleFav: (id: string) => void;
  onNavigate: (id: string) => void;
  onClose: () => void;
};

/** 作品を大きく見る「鑑賞室」。← → キーで前後の作品へ移動できる */
export function Viewer({
  work,
  list,
  rooms,
  faved,
  onToggleFav,
  onNavigate,
  onClose,
}: Props) {
  // 閉じるアニメーション中も中身が消えないよう、最後に見ていた作品を覚えておく
  const [last, setLast] = useState<Work | null>(work);
  if (work && work !== last) setLast(work);
  const shown = work ?? last;

  const [zoomed, setZoomed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setZoomed(false);
    setCopied(false);
  }, [work?.id]);

  const index = work ? list.findIndex((w) => w.id === work.id) : -1;
  const count = list.length;
  const prev = index >= 0 && count > 1 ? list[(index - 1 + count) % count] : null;
  const next = index >= 0 && count > 1 ? list[(index + 1) % count] : null;

  // ← → キーで前後へ
  useEffect(() => {
    if (!work) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && prev) onNavigate(prev.id);
      if (e.key === "ArrowRight" && next) onNavigate(next.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [work, prev, next, onNavigate]);

  // 前後の作品を先読みして、めくったときに待たせない
  useEffect(() => {
    for (const w of [prev, next]) {
      if (w) new Image().src = originalUrl(w.file);
    }
  }, [prev, next]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* クリップボードが使えない環境では何もしない */
    }
  };

  const room = shown ? rooms.find((r) => r.id === shown.room) : undefined;

  return (
    <>
      <Modal.Backdrop
        variant="opaque"
        className="viewer-backdrop"
        isOpen={work !== null}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <Modal.Container size="full" className="viewer-container">
          <Modal.Dialog className="viewer">
            {shown ? (
              <>
                <div className="viewer-stage" data-zoomed={zoomed || undefined}>
                  <div className="viewer-scroll">
                    <div className="frame viewer-frame">
                      <span className="mat">
                        <img
                          key={shown.id}
                          className="viewer-img"
                          src={originalUrl(shown.file)}
                          alt={
                            shown.titleEn
                              ? `${shown.title}（${shown.titleEn}）`
                              : shown.title
                          }
                          width={shown.width}
                          height={shown.height}
                          style={
                            {
                              backgroundImage: `url("${thumbUrl(shown.file)}")`,
                            } as CSSProperties
                          }
                          onClick={() => setZoomed((z) => !z)}
                        />
                      </span>
                    </div>
                  </div>

                  {prev ? (
                    <Tooltip delay={300}>
                      <Button
                        isIconOnly
                        variant="ghost"
                        className="stage-nav stage-prev"
                        aria-label="前の作品"
                        onPress={() => onNavigate(prev.id)}
                      >
                        <ChevronLeftIcon width={26} height={26} />
                      </Button>
                      <Tooltip.Content>前の作品（←）</Tooltip.Content>
                    </Tooltip>
                  ) : null}
                  {next ? (
                    <Tooltip delay={300}>
                      <Button
                        isIconOnly
                        variant="ghost"
                        className="stage-nav stage-next"
                        aria-label="次の作品"
                        onPress={() => onNavigate(next.id)}
                      >
                        <ChevronRightIcon width={26} height={26} />
                      </Button>
                      <Tooltip.Content>次の作品（→）</Tooltip.Content>
                    </Tooltip>
                  ) : null}
                </div>

                <aside className="viewer-panel">
                  <div>
                    <Modal.Heading className="panel-title">
                      {shown.title}
                    </Modal.Heading>
                    {shown.titleEn ? (
                      <p className="panel-en">{shown.titleEn}</p>
                    ) : null}
                  </div>

                  {shown.description ? (
                    <p className="panel-desc">{shown.description}</p>
                  ) : null}

                  <dl className="specs">
                    <div>
                      <dt>制作年</dt>
                      <dd>{shown.year}年</dd>
                    </div>
                    {shown.medium ? (
                      <div>
                        <dt>技法</dt>
                        <dd>{shown.medium}</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt>画像サイズ</dt>
                      <dd>
                        {shown.width} × {shown.height} px
                      </dd>
                    </div>
                    {room ? (
                      <div>
                        <dt>展示室</dt>
                        <dd>{room.name}</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt>収蔵番号</dt>
                      <dd>{String(shown.no).padStart(3, "0")}</dd>
                    </div>
                  </dl>

                  {shown.tags?.length ? (
                    <div className="panel-tags">
                      {shown.tags.map((t) => (
                        <Chip key={t} size="sm" variant="secondary">
                          <Chip.Label>{t}</Chip.Label>
                        </Chip>
                      ))}
                    </div>
                  ) : null}

                  <div className="panel-actions">
                    <Button
                      variant="secondary"
                      aria-pressed={faved}
                      onPress={() => onToggleFav(shown.id)}
                    >
                      <HeartIcon filled={faved} />
                      {faved ? "お気に入りから外す" : "お気に入りに追加"}
                    </Button>
                    <Button variant="secondary" onPress={() => setZoomed((z) => !z)}>
                      {zoomed ? <ZoomOutIcon /> : <ZoomInIcon />}
                      {zoomed ? "全体を見る" : "実寸で見る"}
                    </Button>
                    <Button variant="secondary" onPress={copyLink}>
                      <LinkIcon />
                      {copied ? "コピーしました" : "この作品のリンクをコピー"}
                    </Button>
                    <a
                      className={buttonVariants({ variant: "secondary" })}
                      href={originalUrl(shown.file)}
                      download
                    >
                      <DownloadIcon />
                      画像を保存
                    </a>
                  </div>

                  {index >= 0 ? (
                    <p className="panel-count">
                      {index + 1} / {count}
                    </p>
                  ) : null}
                </aside>

                <Modal.CloseTrigger className="viewer-close" aria-label="閉じる" />
              </>
            ) : null}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
