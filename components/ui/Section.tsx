type Props = {
  id: string;
  children: React.ReactNode;
  className?: string;
};

/** Every page section: anchor target, labelled by its heading, consistent rhythm and gutters. */
export function Section({ id, children, className = "" }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`relative px-[var(--gutter)] py-[clamp(6rem,14vh,11rem)] ${className}`}
    >
      <div className="mx-auto w-full max-w-[1280px]">{children}</div>
    </section>
  );
}
