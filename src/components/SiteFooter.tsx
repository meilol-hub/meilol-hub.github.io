import { site } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-row">
        <p className="footer-name">
          <span className="brand-jp">{site.name}</span>
          <span className="brand-en">{site.nameEn}</span>
        </p>
        <p className="footer-note">
          © {new Date().getFullYear()} {site.author}
          {site.github ? (
            <>
              <br />
              <a href={site.github} rel="noreferrer">
                GitHub
              </a>
            </>
          ) : null}
        </p>
      </div>
    </footer>
  );
}
