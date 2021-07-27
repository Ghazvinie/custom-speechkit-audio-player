import { curry } from './function'
import {
  isInteger, isNil, isArray, isObject,
} from './checkers'
import { toArray, nth } from './array'

export const merge = curry((...args) => (
  Object.assign.apply(null, [{}, ...Array.from(args)])
))

export const paths = curry((pathsArr, obj) => pathsArr.map(items => {
  let val = merge(obj)
  let idx = 0
  let p
  while (idx < items.length) {
    if (val === null) return
    p = items[idx]
    val = isInteger(p) ? nth(p, val) : val[p]
    idx += 1
  }
  return val
}))

export const path = curry((p, obj) => paths([p], obj)[0])

export const pathOr = curry((defaultValue, p, obj) => path(p, obj) || defaultValue)

export const prop = curry((p, obj) => path([p], obj))

export const propOr = curry((defaultValue, p, obj) => prop(p, obj) || defaultValue)

export const assoc = curry((key, value, obj) => merge(obj, { [key]: value }))

export const assocPath = curry((keyPath, value, obj) => {
  if (!keyPath.length) return value
  const [idx] = keyPath
  let newValue = value

  if (keyPath.length > 1) {
    // eslint-disable-next-line no-nested-ternary
    const nextObj = (!isNil(obj) && idx in obj)
      ? obj[idx] : isInteger(keyPath[1])
        ? [] : {}
    newValue = assocPath(Array.prototype.slice.call(keyPath, 1), newValue, nextObj)
  }

  if (isInteger(idx) && isArray(obj)) {
    const arr = [...obj]
    arr[idx] = newValue
    return arr
  }

  return assoc(idx, newValue, obj)
})

export const has = (key, obj) => (
  Object.prototype.hasOwnProperty.call(obj, key)
)

export const omit = curry((names, obj) => (
  Object.keys(obj).filter(key => !names.includes(key)).reduce((acc, next) => ({
    ...acc,
    [next]: obj[next],
  }), {})
))

export const keys = curry(Object.keys)

const filterKeys = curry((obj, key) => (has(key, obj)))

const mergeWithKey = curry((fn, l, r) => {
  const result = keys(l).filter(filterKeys(l)).reduce((acc, item) => ({
    ...acc,
    [item]: has(item, r)
      ? fn(item, l[item], r[item])
      : l[item],
  }), {})

  keys(r).filter(filterKeys(r)).forEach(item => {
    if (!(has(item, result))) {
      result[item] = r[item]
    }
  })

  return result
})

const mergeDeepWithKey = curry((fn, lObj, rObj) => (
  mergeWithKey((k, lVal, rVal) => {
    if (isObject(lVal) && isObject(rVal)) {
      return mergeDeepWithKey(fn, lVal, rVal)
    }

    return fn(k, lVal, rVal)
  }, lObj, rObj)
))

export const deepMerge = curry((lObj, rObj) => (
  mergeDeepWithKey((k, lVal, rVal) => rVal, lObj, rObj)
))

export const pick = curry((names, obj) => toArray(names).reduce((acc, next) => {
  if (has(next, obj)) {
    return assoc(next, obj[next], acc)
  }

  return acc
}, {}))

export const pickAll = curry((names, obj) => toArray(names).reduce((acc, next) => (
  assoc(next, has(next, obj) ? obj[next] : undefined, acc)
), {}))
