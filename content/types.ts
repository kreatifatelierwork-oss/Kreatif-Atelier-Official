/** A headline whose second half is set in italic serif, e.g. "We build brands that *actually move people.*" */
export type SplitHeadline = {
  lead: string;
  emphasis: string;
};

export type SectionIntro = {
  id: string;
  /** "01 · Who We Are" */
  marker: string;
  kicker?: string;
  headline: SplitHeadline;
  intro?: string;
};
