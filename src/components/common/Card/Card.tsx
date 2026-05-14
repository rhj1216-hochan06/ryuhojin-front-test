import type { PropsWithChildren, ReactNode } from 'react';

interface CardProps {
  title?: string;
  description?: string;
  aside?: ReactNode;
  className?: string;
}

export const Card = ({
  title,
  description,
  aside,
  className,
  children,
}: PropsWithChildren<CardProps>) => (
  <article className={['card', className].filter(Boolean).join(' ')}>
    {(title || description || aside) && (
      <div className="card__header">
        <div>
          {title && <h3>{title}</h3>}
          {description && <p>{description}</p>}
        </div>
        {aside && <div className="card__aside">{aside}</div>}
      </div>
    )}
    {children}
  </article>
);

