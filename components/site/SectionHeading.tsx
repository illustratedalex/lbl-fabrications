import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string | null;
  title: string;
  body?: string | null;
  align?: "left" | "center";
  children?: ReactNode;
};

export function SectionHeading({ eyebrow, title, body, align = "left", children }: SectionHeadingProps) {
  return (
    <header className={`site-section-heading site-section-heading--${align}`}>
      {eyebrow ? <p className="site-eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {body ? <p>{body}</p> : null}
      {children}
    </header>
  );
}
