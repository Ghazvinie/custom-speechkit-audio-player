import {
  createStore, combineReducers, applyMiddleware, compose,
} from 'redux'
import thunk from 'redux-thunk'
import logger from '@speechkit/speechkit-audio-player-core/shared/debug/redux'
import { updateProps, updateCurrentTime } from '../actions/playback'
import reducers from '../reducers'
import appMiddleware from '../modules/app-middleware'
import analyticsMiddleware from '../modules/analytics-middleware'
import adsMiddleware from '../modules/ads-middleware'

// eslint-disable-next-line
const isDev = process.env.isDev

const middlewareFns = [
  thunk,
  appMiddleware,
  analyticsMiddleware,
  adsMiddleware,
]

if (isDev) {
  const ignoredActionInLogs = [updateProps, updateCurrentTime]
  middlewareFns.push(logger({ ignoredActionInLogs }))
}

const composeEnhancers =
  // eslint-disable-next-line no-underscore-dangle, max-len
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && isDev ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose

export default () => {
  let store = createStore(
    combineReducers(reducers),
    composeEnhancers(applyMiddleware(...middlewareFns)),
  )

  return {
    store,
    destroy() { store = null },
  }
}
