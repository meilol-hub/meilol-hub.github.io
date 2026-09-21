"use client";

import { Label, Switch } from "@heroui/react";
import { useEffect, useState } from "react";

/** 展示室の照明。ON で昼（明るい壁）、OFF で夜（暗い壁）。選択は localStorage に保存 */
export function LightSwitch() {
  const [lit, setLit] = useState(false);

  useEffect(() => {
    setLit(document.documentElement.classList.contains("light"));
  }, []);

  const change = (next: boolean) => {
    setLit(next);
    const cl = document.documentElement.classList;
    cl.toggle("light", next);
    cl.toggle("dark", !next);
    try {
      localStorage.setItem("yohaku:lights", next ? "on" : "off");
    } catch {
      /* noop */
    }
  };

  return (
    <Switch isSelected={lit} onChange={change} className="lights">
      <Switch.Content>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Label>照明</Label>
      </Switch.Content>
    </Switch>
  );
}
