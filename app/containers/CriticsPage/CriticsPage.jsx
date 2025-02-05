import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchCritics } from '../resources/critics/critics.actions';

const CriticsPage = ({ critics, error, loading, fetchCritics }) => {
  useEffect(() => {
    fetchCritics();
  }, [fetchCritics]);

  if (loading) return <div>Loading critics...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="critics-page">
      <h2>Critics</h2>
      <div className="critics-grid">
        {critics.map(critic => (
          <div key={critic.id} className="critic-card">
            {critic.image && (
              <img 
                src={critic.image} 
                alt={critic.name} 
                className="critic-image"
              />
            )}
            <div className="critic-info">
              <h3>{critic.name}</h3>
              <p>Total Reviews: {critic.reviews_count}</p>
              <p>Critics Picks: {critic.picks_count}</p>
              {critic.bio && <p className="bio">{critic.bio}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  critics: state.resources?.critics?.data || [],
  error: state.resources?.critics?.error || null,
  loading: state.resources?.critics?.loading || false,
});

const mapDispatchToProps = (dispatch) => ({
  fetchCritics: () => dispatch(fetchCritics()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CriticsPage);