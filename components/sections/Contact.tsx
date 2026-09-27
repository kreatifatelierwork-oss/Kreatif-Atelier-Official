import { contact, mailtoHref, site } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { SocialLink } from "@/components/ui/SocialLink";
import { Star } from "@/components/ui/Star";

export function Contact() {
  const { details } = contact;

  return (
    <Section id={contact.id} className="pb-[clamp(4rem,10vh,7rem)]">
      <div className="mx-auto max-w-4xl text-center">
        <p className="eyebrow flex items-center justify-center gap-3 text-gold">
          <Star /> {contact.marker} <Star />
        </p>
        <h2 id={`${contact.id}-heading`} className="display mt-6 text-[clamp(2.8rem,7vw,6rem)] text-cream">
          {contact.headline.lead} <span className="emph block">{contact.headline.emphasis}</span>
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-[1.05rem] leading-relaxed text-cream-muted">{contact.body}</p>

        <a
          href={mailtoHref(contact.cta.subject)}
          className="eyebrow mt-12 inline-flex items-center gap-3 bg-gradient-to-r from-gold via-gold-bright to-gold px-6 py-5 text-[0.7rem] font-semibold tracking-[0.16em] sm:px-8 md:tracking-[0.28em] text-ink shadow-[0_18px_60px_-18px_var(--gold)] transition-[filter,transform] hover:brightness-110 md:px-11"
        >
          {contact.cta.label}
          <Star />
        </a>
      </div>

      <dl className="mx-auto mt-24 grid max-w-5xl gap-10 border-t border-line pt-12 text-center md:grid-cols-3">
        <div>
          <dt className="eyebrow text-[0.62rem] text-gold">{details.locationLabel}</dt>
          <dd className="display mt-3 text-[1.35rem] leading-snug text-cream">
            {details.location[0]}
            <br />
            <span className="text-cream-muted">{details.location[1]}</span>
          </dd>
        </div>
        <div>
          <dt className="eyebrow text-[0.62rem] text-gold">{details.emailLabel}</dt>
          <dd className="display mt-3 text-[1.35rem] text-cream">
            <a href={mailtoHref()} className="underline decoration-gold/40 underline-offset-4 hover:text-gold-bright">
              {site.email}
            </a>
          </dd>
        </div>
        <div>
          <dt className="eyebrow text-[0.62rem] text-gold">{details.socialLabel}</dt>
          <dd className="display mt-3 text-[1.35rem] leading-snug text-cream">
            {site.handle}
            <br />
            <span className="text-[1.05rem] text-cream-muted">
              {details.socialNetworks.map((n, i) => (
                <span key={n.key}>
                  {i > 0 && " · "}
                  <SocialLink network={n.key}>{n.label}</SocialLink>
                </span>
              ))}
            </span>
          </dd>
        </div>
      </dl>
    </Section>
  );
}
