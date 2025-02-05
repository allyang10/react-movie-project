import {
  REVIEWS_FETCH_SUCCESS,
  REVIEWS_FETCH_FAILURE,
} from './reviews.actions'; // Import action types

const initialState = {
  data: [],
  error: null, // Initialize error state to null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case REVIEWS_FETCH_SUCCESS:
      // When the fetch is successful, update the state with the data
      return {
        ...state,
        // payload should be the array of reviews?
        data: action.payload,
        // Clear any previous errors
        error: null,
      };
    case REVIEWS_FETCH_FAILURE:
      // if the fetch fails, update the state with the error
      return {
        ...state,
        // Store the error message
        error: action.error,
      };
    case 'SET_FILTERS':
      // update the filters
      return {
        ...state,
        filters: action.payload,
      };
    default:
      // If the action type doesn't match, return the current state
      return state;
  }
}

