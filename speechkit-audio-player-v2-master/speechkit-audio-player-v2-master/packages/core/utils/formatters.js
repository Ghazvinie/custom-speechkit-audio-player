import { map } from './array'
import { ifProp } from './checkers'

const SHORT_MONTH_NAMES = [
  'Jan', 'Feb', 'Mar',
  'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec',
]

const addAdditionalZero = val => (
  `0${val}`.slice(-2)
)

const defaultFormatTime = { onlySeconds: false, withAdditionalZero: false }

export const formatTime = (
  seconds = 0,
  { onlySeconds, withAdditionalZero } = defaultFormatTime,
) => {
  if (onlySeconds) {
    return `${seconds || 0}s`
  }
  const minutes = Math.floor(seconds / 60)
  return `${ifProp(withAdditionalZero, addAdditionalZero(minutes), minutes)}:${addAdditionalZero(Math.floor(seconds % 60))}`
}

export const formatDate = (date, lang) => {
  const dateObj = new Date(date)
  const day = dateObj.getDate()
  const monthIndex = dateObj.getMonth()
  const year = dateObj.getFullYear()

  return ['ru', 'de'].includes(lang)
    ? map(addAdditionalZero, [day, monthIndex + 1]).concat([year]).join('.')
    : `${SHORT_MONTH_NAMES[monthIndex]} ${day}, ${year}`
}
