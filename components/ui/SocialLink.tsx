import { site } from "@/content/site";

type Props = {
  network: "instagramUrl" | "linkedinUrl";
  children: React.ReactNode;
  className?: string;
};

/** Renders a real link once the URL is filled in `content/site.ts`; plain text until then. */
export function SocialLink({ network, children, className = "" }: Props) {
  const href = site[network];
  if (!href) return <span className={className}>{children}</span>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold-bright hover:decoration-gold ${className}`}
    >
      {children}
    </a>
  );
}
