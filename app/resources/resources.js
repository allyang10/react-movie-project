import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'

// Reviews
import reviewsReducer from './reviews/reviews.reducer'
import reviewsEpic from './reviews/reviews.epics'

export const resourcesEpic = combineEpics(
  reviewsEpic,
)

export const resourcesReducer = combineReducers({
  reviews: reviewsReducer,
})
