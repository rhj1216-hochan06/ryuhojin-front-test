import type { SectionCopy } from '../i18n/dictionary';

interface PageIntroProps {
  id: string;
  copy: SectionCopy;
}

export const PageIntro = ({ id, copy }: PageIntroProps) => (
  <section className="page-intro" aria-labelledby={`${id}-title`} data-reveal>
    <p className="eyebrow">{copy.eyebrow}</p>
    <h1 id={`${id}-title`}>{copy.title}</h1>
    <p>{copy.description}</p>
  </section>
);
