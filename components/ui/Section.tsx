type Props = {
  id: string;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  ref?: React.Ref<HTMLElement>;
};

/** Every page section: anchor target, labelled by its heading, consistent rhythm and gutters. */
export function Section({ id, children, className = "", innerClassName = "", ref }: Props) {
  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`relative px-[var(--gutter)] py-[clamp(6rem,14vh,11rem)] ${className}`}
    >
      <div className={`mx-auto w-full max-w-[1280px] ${innerClassName}`}>{children}</div>
    </section>
  );
}
