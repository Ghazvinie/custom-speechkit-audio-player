import {
  curry,
  isFunction,
} from '../../utils'

export const setTags = curry((configure, scope) => {
  Object.entries(configure).forEach(([k, v]) => { scope.setTag(k, v) })
})

export const getSentry = () => window.Sentry

export const getLocalSentry = () => (
  (window.SpeechKit && window.SpeechKit.Sentry) || getSentry()
)

const listFn = ['getCurrentHub', 'getClient', 'getDsn']

export const getDsn = () => {
  const sentry = getSentry()

  if (sentry) {
    const dsn = listFn.reduce((acc, next) => {
      if (isFunction(acc[next])) {
        return acc[next]()
      }

      return {}
    }, sentry)

    if (dsn.user) {
      const {
        protocol, host, user, projectId,
      } = dsn
      return `${protocol}://${user}@${host}/${projectId}`
    }
  }

  return null
}
