export const roundFloat = (value, fixed = 2) => (
  Number.parseFloat(Number.parseFloat(value).toFixed(fixed)) || 0
)

export const calcPercentage = (val, base) => roundFloat(
  ((val / (base || 1)) * 100) || 0,
)

export const parseInt = val => Number.parseInt(val, 10)

const maxRange = 256

const getRandomValues = (min, max) => {
  const crypto = window.crypto || window.msCrypto || null
  if (crypto && typeof crypto.getRandomValues === 'function') {
    let byteArray = new Uint8Array(1)
    byteArray = crypto.getRandomValues(byteArray)
    return byteArray[0]
  }

  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getRandomInt = (min, max) => {
  if (max >= maxRange) {
    // eslint-disable-next-line no-throw-literal
    throw 'limit is exceeded'
  }
  const randomInt = getRandomValues(min, max)
  const range = (max - min) + 1

  if (randomInt >= Math.floor(maxRange / range) * range) {
    return getRandomInt(min, max)
  }

  return min + (randomInt % range)
}
