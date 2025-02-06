import React from 'react';
import PropTypes from 'prop-types';

/**
 * ReviewDetail - shows reviews more in detail
 */
const ReviewDetail = ({ review }) => (
  <div className="review-content">
    {/* Review title with fallback */}
    <h1 id="modal-title">{review.display_title || 'Untitled Review'}</h1>
    
    {/* Conditional image rendering */}
    {(review.multimedia && review.multimedia.src) && (
      <img 
        src={review.multimedia.src} 
        alt={review.display_title || 'Movie poster'} 
        className="detail-image"
        loading="lazy"
      />
    )}

    {/* Metadata section */}
    <div className="detail-meta">
      {/* MPAA rating */}
      {review.mpaa_rating && (
        <div className="meta-item">
          <strong>Rating:</strong> {review.mpaa_rating}
        </div>
      )}
      
      {/* Critic's pick badge */}
      {review.critics_pick === 1 && (
        <div className="meta-item critics-pick">
          ⭐ Critic's Pick
        </div>
      )}

      {/* Publication date */}
      <div className="meta-item">
        <strong>Published:</strong> {review.publication_date ? 
          new Date(review.publication_date).toLocaleDateString() : 
          'Date unavailable'}
      </div>

      {/* Reviewer/critic */}
      <div className="meta-item">
        <strong>Review by:</strong> {review.byline || 'Unknown critic'}
      </div>
    </div>

    {/* Review body content */}
    <div className="detail-body">
      <h2>{review.headline || 'Review headline'}</h2>
      <p className="summary">
        {review.summary_short || 'No summary available'}
      </p>
      
      {/* link to article */}
      {review.link && review.link.url && (
        <a
          href={review.link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="article-link"
        >
          {review.link.suggested_link_text || 'Read Full Review'}
        </a>
      )}
    </div>
  </div>
);


ReviewDetail.propTypes = {
  review: PropTypes.shape({
    display_title: PropTypes.string,
    multimedia: PropTypes.shape({
      src: PropTypes.string
    }),
    mpaa_rating: PropTypes.string,
    critics_pick: PropTypes.number,
    publication_date: PropTypes.string,
    byline: PropTypes.string,
    headline: PropTypes.string,
    summary_short: PropTypes.string,
    link: PropTypes.shape({
      url: PropTypes.string,
      suggested_link_text: PropTypes.string
    })
  }).isRequired
};

export default ReviewDetail;