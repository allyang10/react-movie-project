import React, { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SearchFilters from '../App/components/searchFilters';
import ReviewDetail from '../ReviewDetail/ReviewDetail';
import hesImg from 'images/hes.png';
import { getMovieReviews } from 'resources/reviews/reviews.actions';


export function HomePage(props) {
  // Router history for navigation
  const history = useHistory();
  
  // Local state for pagination and selected review
  const [limit, setLimit] = useState(20);
  const [selectedReview, setSelectedReview] = useState(null);

  // Destructure props from Redux store
  const { reviews, error, getMovieReviews, filters, setFilters } = props;

  // Fetch reviews on component mount
  useEffect(() => {
    getMovieReviews();
  }, [getMovieReviews]); // Dependency array ensures single fetch

  // Handle review selection with keyboard support
  const handleReviewClick = (review, e) => {
    // Support both mouse click and keyboard navigation
    if (e.type === 'click' || e.key === 'Enter') {
      setSelectedReview(review);
      history.push(`?review=${review.id}`); // Update URL for direct linking
    }
  };

  // Close modal and clean up URL
  const handleCloseDetail = (e) => {
    if (e.type === 'click' || e.key === 'Escape') {
      setSelectedReview(null);
      history.replace('/'); // keep URL clean
    }
  };

  // Memoized filtered reviews for performance
  const filteredReviews = useMemo(() => {
    return (reviews || [])
      .filter(review => {
        // Filtering logic with null safety
        const title = review.display_title || '';
        const matchesSearch = title.toLowerCase().includes(
          (filters.searchTerm || '').toLowerCase()
        );
        const matchesRating = !filters.mpaaRating || 
          (review.mpaa_rating === filters.mpaaRating);
        const matchesDate = !filters.publicationDate || 
          (review.publication_date === filters.publicationDate);
        const matchesCriticsPick = !filters.criticsPick || 
          (review.critics_pick === 1);
        
        return matchesSearch && matchesRating && matchesDate && matchesCriticsPick;
      })
      .sort((a, b) => new Date(b.publication_date) - new Date(a.publication_date))
      .slice(0, limit);
  }, [reviews, filters, limit]); // Re-run when dependencies change

  // Memoized unique ratings for filter dropdown
  const mpaaRatings = useMemo(() => {
    return [...new Set(
      (reviews || [])
        .map(review => review.mpaa_rating)
        .filter(Boolean) // Remove empty values
    )];
  }, [reviews]);

  return (
    <div className="home-page">
      <Helmet>
        <title>Movie Reviews</title>
        <meta name="description" content="Browse latest movie reviews" />
      </Helmet>

      {/* Sticky header with filters */}
      <div className="header">
        <header className="page-header">
          <img src={hesImg} alt="HES Logo" className="header-logo" />
          <h1>Movie Reviews</h1>
        </header>

        {/* Search and filter controls */}
        <SearchFilters
          searchTerm={filters.searchTerm}
          filters={filters}
          mpaaRatings={mpaaRatings}
          onSearch={(term) => setFilters({ ...filters, searchTerm: term })}
          onFilter={(type, value) => setFilters({ ...filters, [type]: value })}
        />
      </div>

      {/* Main content area */}
      <main className="main-content">
        {/* Error display with ARIA live region */}
        {error && (
          <div className="error-message" role="alert" aria-live="assertive">
            Error: {error.toString()}
          </div>
        )}

        {/* Responsive reviews grid */}
        <div className="reviews-grid">
          {filteredReviews.map(review => (
            <article 
              key={review.id}
              className="review-card"
              onClick={(e) => handleReviewClick(review, e)}
              onKeyPress={(e) => handleReviewClick(review, e)}
              tabIndex="0"
              aria-label={`View details for ${review.display_title}`}
            >
              {/* Review image with fallback handling */}
              {review.multimedia && review.multimedia.src && (
                <img
                  src={review.multimedia.src}
                  alt={review.display_title || 'Movie poster'}
                  className="review-image"
                />
              )}
              
              {/* Review content */}
              <div className="review-content">
                <h2 className="review-title">
                  {review.display_title || 'Untitled Review'}
                </h2>
                <div className="review-meta">
                  {review.publication_date && (
                    <span className="publication-date">
                      {new Date(review.publication_date).toLocaleDateString()}
                    </span>
                  )}
                  {review.mpaa_rating && (
                    <span className="mpaa-rating">{review.mpaa_rating}</span>
                  )}
                  {review.critics_pick === 1 && (
                    <span className="critics-pick">⭐ Critic's Pick</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* load more reviews */}
        {filteredReviews.length >= limit && limit < 50 && (
          <button 
            className="load-more"
            onClick={() => setLimit(prev => Math.min(prev + 20, 50))}
            onKeyPress={(e) => e.key === 'Enter' && setLimit(prev => Math.min(prev + 20, 50))}
            tabIndex="0"
          >
            Load More ({Math.max(50 - limit, 0)} remaining)
          </button>
        )}

        {/* detailed view of reviews, popout */}
        {selectedReview && (
          <div 
            className="modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-content">
              <button 
                className="close-button"
                onClick={handleCloseDetail}
                onKeyDown={handleCloseDetail}
                tabIndex="0"
                aria-label="Close modal"
                autoFocus // Focus first element when modal opens
              >
                &times;
              </button>
              <ReviewDetail review={selectedReview} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Redux connection setup
const mapStateToProps = (state) => ({
  reviews: state.resources && state.resources.reviews && state.resources.reviews.data || [],
  error: state.resources && state.resources.reviews && state.resources.reviews.error || null,
  filters: state.resources && state.resources.reviews && state.resources.reviews.filters || {},
});

const mapDispatchToProps = (dispatch) => ({
  getMovieReviews: () => dispatch(getMovieReviews()),
  setFilters: (filters) => dispatch({ type: 'SET_FILTERS', payload: filters }),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(HomePage);