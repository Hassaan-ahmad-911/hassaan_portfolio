import type { CSSProperties, ElementType, HTMLAttributes } from "react";

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  /** Seconds to wait before this element animates in */
  delay?: number;
  /** Distance in px the element rises from */
  y?: number;
};

/**
 * Fades and lifts its children into place the first time they scroll into view.
 * Pure CSS + one shared IntersectionObserver (see RevealObserver), so it costs
 * nothing to hydrate. Without JavaScript the content is simply visible.
 */
export function Reveal({ as: Tag = "div", delay, y, style, ...props }: RevealProps) {
  const vars: Record<string, string> = {};
  if (delay) vars["--reveal-delay"] = `${delay}s`;
  if (y !== undefined) vars["--reveal-y"] = `${y}px`;
  return <Tag data-reveal="" style={{ ...vars, ...style } as CSSProperties} {...props} />;
}
