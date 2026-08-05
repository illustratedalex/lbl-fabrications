type ContentModeBadgeProps = {
  source: "remote" | "fallback";
  reason: string | null;
  visible?: boolean;
};

export function ContentModeBadge(props: ContentModeBadgeProps) {
  const visible = props.visible ?? process.env.NODE_ENV !== "production";

  if (!visible) {
    return null;
  }

  const label = props.source === "remote" ? "Content Builder preview" : "Fallback content";
  const title = props.reason ?? "Live content source is active.";

  return (
    <p className="content-mode-badge" title={title}>
      {label}
    </p>
  );
}
