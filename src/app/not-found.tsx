import Link from "next/link";
import { buttonVariants } from "@heroui/react";

export default function NotFound() {
  return (
    <section className="shell notfound">
      <h1>この展示室は見つかりませんでした</h1>
      <p>URL が変わったか、まだ公開されていないページかもしれません。</p>
      <Link href="/" className={buttonVariants({ variant: "secondary" })}>
        入口へ戻る
      </Link>
    </section>
  );
}
