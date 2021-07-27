import { isArray, isString } from './checkers'
import { curry } from './function'

export const arrayToHashMap = arr => (
  isArray(arr) ? arr.reduce((acc, next) => ({ ...acc, [next]: next }), {}) : {}
)

export const makeEmptyArray = (size = 0) => ([...Array(size).keys()])

export const map = curry((fn, arr) => arr.map(item => fn(item)))

export const find = curry((fn, arr) => arr.find(item => fn(item)))

export const toArray = val => isArray(val) ? val : [val]

export const nth = curry((offset, list) => {
  const idx = offset < 0 ? list.length + offset : offset
  return isString(list) ? list.charAt(idx) : list[idx]
})

export const head = nth(0)

export const insertItem = (item, index, arr) => (
  [...arr.slice(0, index), item, ...arr.slice(index)]
)
