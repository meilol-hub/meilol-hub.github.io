import type { CSSProperties } from "react";
import { buttonVariants } from "@heroui/react";
import type { Work } from "@/lib/types";
import { site } from "@/config/site";
import { originalUrl } from "@/lib/path";
import { Frame } from "./Frame";

type Props = { work: Work; onOpen: (id: string) => void };

/** 入口。一番の作品を壁に掛け、スポットライトを当てる */
export function Hero({ work, onOpen }: Props) {
  const style = {
    "--ar": work.width / work.height,
    "--h": "min(64vh, 620px)",
  } as CSSProperties;

  return (
    <section className="hero" id="top" aria-label="入口">
      <div className="shell hero-grid">
        <div className="hero-title">
          <h1>{site.name}</h1>
          <p className="hero-en">{site.nameEn}</p>
        </div>

        <div className="hero-stage">
          <div className="hero-light" aria-hidden="true" />
          <div className="hung" style={style}>
            <Frame
              work={work}
              src={originalUrl(work.file)}
              eager
              onOpen={() => onOpen(work.id)}
            />
          </div>
        </div>

        <div className="hero-side">
          <p className="hero-lead">
            {site.tagline}
            <br />
            {site.lead}
          </p>
          <div className="plaque">
            <p className="plaque-title">{work.title}</p>
            {work.titleEn ? <p className="plaque-en">{work.titleEn}</p> : null}
            <p className="plaque-meta">
              {work.year}年
              {work.medium ? `　${work.medium}` : ""}
            </p>
          </div>
          <a href="#gallery" className={buttonVariants({ variant: "secondary" })}>
            展示室へ進む
          </a>
        </div>
      </div>
    </section>
  );
}
