import { compose, curry } from './function'
import { ifProp } from './checkers'
import { encodeURIComp } from './dom'

export const trim = (val, ...args) => (
  val.reduce((acc, next, idx) => (
    `${acc}${next}${(args[idx] || '')}`
  ), '').split(/\s|\\n+/).join('')
)

export const decamelize = (str, separator = '_') => {
  const newSubStr = `$1${separator}$2`

  return str
    .replace(/([a-z\d])([A-Z])/g, newSubStr)
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, newSubStr)
    .toLowerCase()
}

export const camelize = str => (
  str.replace(/[_.-](\w|$)/g, (_, x) => (
    x.toUpperCase()
  ))
)

export const firstLetterToUpperCase = (str = '') => (
  str.replace(/^\b[a-zA-Z]/g, match => match.toUpperCase())
)

export const getFileExtension = compose(
  ([, extension = '']) => extension,
  name => /\.([^]{3,4})$/.exec(name) || [],
)

export const assocUrlParam = curry((url, key, value) => {
  const separator = ifProp(/\?/.test(url), '&', '?')
  return `${url}${separator}${key}=${encodeURIComp(value)}`
})

export const makeInlineScript = (str = '') => (
  String(str).replace(/(\r\n|\n|\r)/gm, '').trim()
)
