import type { PropsWithChildren, ReactNode } from 'react';

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export const Section = ({
  id,
  eyebrow,
  title,
  description,
  actions,
  children,
}: PropsWithChildren<SectionProps>) => (
  <section id={id} className="section" aria-labelledby={`${id}-title`} data-reveal>
    <div className="section__header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{description}</p>
      </div>
      {actions && <div className="section__actions">{actions}</div>}
    </div>
    {children}
  </section>
);
