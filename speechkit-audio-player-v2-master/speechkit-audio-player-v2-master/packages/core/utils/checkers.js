import { curry, compose } from './function'

export const is = curry((ctor, val) => (
  val != null && (val.constructor === ctor || val instanceof ctor)
))

export const isInteger = val => Number.isInteger(val)

export const isString = is(String)

export const isFunction = is(Function)

export const isObject = is(Object)

export const { isArray } = Array

export const isNil = val => val == null

export const not = val => !val

export const notNil = val => not(isNil(val))

export const isTrue = compose(
  val => val === 'true' || val === '1',
  (val = '') => String(val).toLowerCase(),
)

export const isFalse = compose(
  not,
  isTrue,
)

export const eq = curry((a, b) => (a === b))

export const ifProp = curry((prop, truthyOption, falsyOption) => (
  prop ? truthyOption : falsyOption
))
