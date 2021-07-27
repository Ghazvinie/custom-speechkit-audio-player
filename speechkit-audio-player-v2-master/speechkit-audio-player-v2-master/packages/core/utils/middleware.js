import { isFunction } from './checkers'
import { curry } from './function'
import { prop, has } from './object'

export const createWatcherMiddleware = curry((handlers, store, next, action) => {
  const state = next(action)
  const { type, payload } = action

  if (has(type, handlers)) {
    const act = prop(type, handlers)
    if (isFunction(act)) {
      act(payload, action, store)
    }
  }

  return state
})
