/** The ✦ brand motif as inline SVG so it renders identically everywhere (the glyph isn't in our fonts). */
export function Star({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={`inline-block h-[0.8em] w-[0.8em] shrink-0 fill-current align-[-0.05em] ${className}`}
    >
      <path d="M12 0c.9 7.2 4.8 11.1 12 12-7.2.9-11.1 4.8-12 12-.9-7.2-4.8-11.1-12-12C7.2 11.1 11.1 7.2 12 0z" />
    </svg>
  );
}
