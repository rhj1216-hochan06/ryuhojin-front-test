import { useEffect, useState } from 'react';
import type { PublishedWorksCopy, SectionCopy } from '../../i18n/dictionary';
import type { PublishedWork } from '../../types/dashboard';
import { Card } from '../common/Card';
import { Section } from '../common/Section';

const slideshowIntervalMs = 3600;

interface PublishedWorksSectionProps {
  section: SectionCopy;
  copy: PublishedWorksCopy;
  works: PublishedWork[];
}

interface PublishedWorkCardProps {
  copy: PublishedWorksCopy;
  work: PublishedWork;
}

interface PublishedWorkMediaProps {
  work: PublishedWork;
}

const PublishedWorkMedia = ({ work }: PublishedWorkMediaProps) => {
  const images = work.screenshot.images
    ?? (work.screenshot.imageUrl
      ? [{ src: work.screenshot.imageUrl, alt: work.screenshot.alt }]
      : []);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [work.id]);

  useEffect(() => {
    if (images.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % images.length);
    }, slideshowIntervalMs);

    return () => window.clearInterval(timer);
  }, [images.length]);

  if (images.length > 0) {
    return (
      <div className="published-work-card__image-frame">
        {images.map((image, index) => (
          <img
            key={image.src}
            className={index === activeIndex ? 'is-active' : undefined}
            src={image.src}
            alt={image.alt}
            aria-hidden={images.length > 1 && index !== activeIndex}
          />
        ))}
        {images.length > 1 && (
          <div className="published-work-card__dots" aria-hidden="true">
            {images.map((image, index) => (
              <span
                key={image.src}
                className={index === activeIndex ? 'is-active' : undefined}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="published-work-card__placeholder"
      role="img"
      aria-label={work.screenshot.alt}
    >
      <span>{work.siteName}</span>
      <strong>{work.screenshot.statusLabel}</strong>
    </div>
  );
};

const PublishedWorkCard = ({ copy, work }: PublishedWorkCardProps) => {
  const hasExternalLink = Boolean(work.externalLink);

  return (
    <Card className="published-work-card">
      <figure className="published-work-card__media">
        <PublishedWorkMedia work={work} />
        <figcaption>{work.screenshot.note}</figcaption>
      </figure>

      <div className="published-work-card__content">
        <div className="published-work-card__header">
          <div>
            <h3>{work.siteName}</h3>
            <p>{work.shortDescription}</p>
          </div>
          {hasExternalLink && work.externalLink ? (
            <a
              className="button published-work-card__link"
              href={work.externalLink}
              target="_blank"
              rel="noreferrer"
              aria-label={`${work.siteName} ${copy.openLinkLabel}`}
            >
              {copy.openLinkLabel}
            </a>
          ) : (
            <button
              className="button button--ghost published-work-card__link"
              type="button"
              disabled
              aria-label={`${work.siteName} ${copy.unavailableLinkLabel}`}
            >
              {copy.unavailableLinkLabel}
            </button>
          )}
        </div>

        <div className="published-work-card__block">
          <h4>{work.roleTitle ?? copy.roleLabel}</h4>
          <p>{work.myRole}</p>
        </div>

        <div className="published-work-card__block">
          <h4>{copy.technologiesLabel}</h4>
          <ul className="published-work-card__tags">
            {work.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        </div>

        <div className="published-work-card__block">
          <h4>{copy.implementationPointsLabel}</h4>
          <ul className="published-work-card__points">
            {work.implementationPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export const PublishedWorksSection = ({
  section,
  copy,
  works,
}: PublishedWorksSectionProps) => (
  <Section
    id="published-works"
    eyebrow={section.eyebrow}
    title={section.title}
    description={section.description}
  >
    <div className="published-work-context" aria-label={section.title}>
      <span>{copy.demoRoleLabel}</span>
      <span>{copy.publishedRoleLabel}</span>
    </div>

    <div className="published-work-list">
      {works.map((work) => (
        <PublishedWorkCard key={work.id} copy={copy} work={work} />
      ))}
    </div>
  </Section>
);
