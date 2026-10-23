import { useState, useEffect, useCallback } from 'react';
import trainings from '../data/trainings.js';

function TrainingRow({ training, reversed, autoPlayInterval = 3500 }) {
  const images = training.images || [];
  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fallbacks across different naming conventions
  const targetUrl = training.externalUrl || training.First_Cambodia_Url || training.certificateUrl;
  const linkText =
    training.linkLabel ||
    training.certificateLabel ||
    (training.certificateUrl ? 'Certificate' : 'Visit Website');

  const goToNext = useCallback(() => {
    if (!hasMultipleImages) return;
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [hasMultipleImages, images.length]);

  const goToIndex = (e, index) => {
    e.stopPropagation();
    setActiveIndex(index);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToNext();
    }
  };

  // Auto-play timer that pauses on user hover or focus
  useEffect(() => {
    if (!hasMultipleImages || isPaused) return;

    const timer = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [hasMultipleImages, isPaused, autoPlayInterval, goToNext]);

  return (
    <div
      className={`training-row${reversed ? ' training-row-reversed' : ''}`}
      data-aos="fade-up"
    >
      <div className="training-media">
        {hasImages ? (
          <div
            className="training-media-slider"
            role="button"
            tabIndex={0}
            onClick={goToNext}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            aria-label={`${training.title} photo ${activeIndex + 1} of ${images.length}. Click to see next photo.`}
          >
            <img
              key={activeIndex}
              src={images[activeIndex]}
              alt={`${training.title} — photo ${activeIndex + 1} of ${images.length}`}
              loading="lazy"
              className="training-media-img"
            />

            {hasMultipleImages && (
              <div className="training-media-dots">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`training-media-dot${index === activeIndex ? ' is-active' : ''}`}
                    onClick={(e) => goToIndex(e, index)}
                    aria-label={`Go to photo ${index + 1}`}
                    aria-current={index === activeIndex ? 'true' : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="training-media-placeholder">
            <i className="bi bi-image"></i>
            <span>Add photo</span>
          </div>
        )}
      </div>

      <div className="training-content">
        {/* Header: Title and Date */}
        <div
          className="training-heading-row"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: '12px',
            marginBottom: '4px',
          }}
        >
          <h3 style={{ margin: 0 }}>{training.title}</h3>
          <span
            className="training-date"
            style={{ fontSize: '0.875rem', color: '#6b7280', whiteSpace: 'nowrap' }}
          >
            {training.date}
          </span>
        </div>

        {/* Organization */}
        <p
          className="training-org"
          style={{ margin: '0 0 10px 0', fontWeight: '600', color: '#4b5563' }}
        >
          {training.org}
        </p>

        {/* Description */}
        <p
          className="training-description"
          style={{ margin: '0 0 14px 0', lineHeight: 1.6, color: '#374151' }}
        >
          {training.description}
        </p>

        {/* Skill / Category Tags (Separated Pill Badges) */}
        {training.tags && training.tags.length > 0 && (
          <div
            className="training-tags"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            {training.tags.map((tag, idx) => (
              <span
                key={idx}
                className="training-tag"
                style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  fontSize: '0.78rem',
                  fontWeight: '500',
                  border: '1px solid #e5e7eb',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Highlights List */}
        {training.highlights && training.highlights.length > 0 && (
          <ul
            className="training-highlights"
            style={{
              margin: '0 0 18px 0',
              paddingLeft: '20px',
              lineHeight: 1.65,
              color: '#4b5563',
            }}
          >
            {training.highlights.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '6px' }}>
                {item}
              </li>
            ))}
          </ul>
        )}

        {/* Action / Certificate / External Link */}
        {targetUrl ? (
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="training-cert-link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '600',
              textDecoration: 'none',
            }}
          >
            {linkText.toUpperCase()} <i className="bi bi-box-arrow-up-right"></i>
          </a>
        ) : (
          <span className="training-cert-link training-cert-link-disabled">
            {linkText.toUpperCase()} — add link
          </span>
        )}
      </div>
    </div>
  );
}

export default function Trainings() {
  return (
    <section id="trainings" className="trainings section">
      <div className="container section-title">
        <span className="eyebrow">Skills &amp; Experience</span>
        <h2>
          Trainings &amp; Activities<span className="blink-caret">|</span>
        </h2>
        <p>
          Events, Activities, and hands-on trainings I&apos;ve taken part in — add your own as
          you complete them.
        </p>
      </div>
      <div className="container">
        <div className="training-list">
          {trainings.map((training, index) => (
            <TrainingRow key={training.id} training={training} reversed={index % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}