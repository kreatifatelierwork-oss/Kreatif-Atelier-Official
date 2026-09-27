export function Tags({ tags, className = "" }: { tags: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-line px-3 py-1 text-[0.7rem] tracking-[0.08em] text-cream-muted"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
