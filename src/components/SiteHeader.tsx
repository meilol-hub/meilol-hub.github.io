import { LightSwitch } from "./LightSwitch";
import { site } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-row">
        <a href="#top" className="brand">
          <span className="brand-jp">{site.name}</span>
          <span className="brand-en">{site.nameEn}</span>
        </a>
        <div className="header-actions">
          <a href="#gallery" className="nav-link">
            展示室
          </a>
          <LightSwitch />
        </div>
      </div>
    </header>
  );
}
