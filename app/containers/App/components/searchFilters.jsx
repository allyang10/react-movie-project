// SearchFilters.jsx
import React from 'react';
import PropTypes from 'prop-types';

const SearchFilters = ({ searchTerm, filters, mpaaRatings, onSearch, onFilter }) => (
  <div className="search-filters" role="group" aria-label="Review filters">
    <div className="filter-group">
      {/* Add label for the form  */}
      {/* FIXME the label is not working right now */}
      <label for="search-input" className="visually-hidden">Search titles</label>
      <input
        id="search-input"
        type="text"
        placeholder="Search movie titles..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="search-input"
        tabIndex="0"
        aria-label="Search movie titles"
      />
    </div>

    <div className="filter-group">
      <label htmlFor="rating-filter" className="visually-hidden">Filter by rating</label>
      {/* In SearchFilters.jsx - Updated select dropdown */}
      <select
        id="rating-filter"
        value={filters.mpaaRating}
        onChange={(e) => onFilter('mpaaRating', e.target.value)}
        className="rating-filter"
        tabIndex="0"
        aria-label="Filter by MPAA rating"
        onKeyDown={(e) => {
          // Use space to open dropdown for keyboard accessibility
          if (e.key === ' ') {
            e.target.click();
          }
        }}
      >
        <option value="">All Ratings</option>
        {mpaaRatings.map(rating => (
          <option key={rating} value={rating}>{rating}</option>
        ))}
      </select>
    </div>

    <div className="filter-group">
      {/* FIXME this label is not working right now */}
      <label htmlFor="date-filter" className="visually-hidden">Filter by date</label>
      <input
        id="date-filter"
        type="date"
        value={filters.publicationDate}
        onChange={(e) => onFilter('publicationDate', e.target.value)}
        className="date-filter"
        tabIndex="0"
        aria-label="Filter by publication date"
      />
    </div>

    <div className="filter-group">
      <div 
        role="checkbox"
        aria-checked={filters.criticsPick}
        tabIndex="0"
        className="critics-pick-filter"
        onKeyPress={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            onFilter('criticsPick', !filters.criticsPick);
          }
        }}
      >
        <input
          type="checkbox"
          id="critics-pick-checkbox"
          checked={filters.criticsPick}
          onChange={(e) => onFilter('criticsPick', e.target.checked)}
          tabIndex="-1"
          style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }}
        />
        <label 
          htmlFor="critics-pick-checkbox"
          className="checkbox-label"
          aria-hidden="true"
        >
          {filters.criticsPick ? '✓' : ''}
        </label>
        <span>Only Critics' Picks</span>
      </div>
    </div>
  </div>
);

SearchFilters.propTypes = {
  searchTerm: PropTypes.string,
  filters: PropTypes.shape({
    mpaaRating: PropTypes.string,
    publicationDate: PropTypes.string,
    criticsPick: PropTypes.bool,
  }),
  mpaaRatings: PropTypes.arrayOf(PropTypes.string),
  onSearch: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
};

export default SearchFilters;