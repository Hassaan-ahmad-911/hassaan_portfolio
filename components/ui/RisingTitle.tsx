/** Page title whose words rise from behind a mask on load (CSS only, so it paints immediately). */
export function RisingTitle({ text, id, className }: { text: string; id?: string; className?: string }) {
  const words = text.split(" ");
  return (
    <h1 id={id} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="flex flex-wrap gap-x-[0.22em]">
        {words.map((word, i) => (
          <span key={i} className="block overflow-hidden pb-[0.06em]">
            <span className="intro-rise" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
              {word}
            </span>
          </span>
        ))}
      </span>
    </h1>
  );
}
