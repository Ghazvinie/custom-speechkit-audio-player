import { createAction } from 'redux-act'
import { curry, merge, eq } from '@speechkit/speechkit-audio-player-core/utils'
import { PLAYER_TYPE } from '../constants/player'

export const createAct = curry((actionPrefix, actionName) => (
  createAction(`${actionPrefix}/${actionName}`)
))

export const createReducer = (initialState, handlers) => (
  (state = initialState, action) => (
    handlers[action.type] ? handlers[action.type](state, action) : state
  )
)

export const mapDispatchToPropsFactory = draft => dispatch => ({
  actions: Object.entries(draft)
    .reduce((dispatchProps, [key, actionCreator]) => (
      merge(dispatchProps, { [key]: (...args) => dispatch(actionCreator(...args)) })
    ), {}),
})

export const checkIsPlaylist = ({ player: playerType }) => (
  eq(PLAYER_TYPE.playlist, playerType)
)
