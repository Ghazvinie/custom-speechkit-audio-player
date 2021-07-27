import {
  not,
  merge,
  eq,
  getHostname,
} from '../../utils'
import {
  SENTRY_SAMPLE_RATE,
  SENTRY_DSN,
  defaultConfigure,
} from './constants'
import {
  setTags,
  getSentry,
  getLocalSentry,
  getDsn,
} from './helpers'

// eslint-disable-next-line prefer-destructuring
const isDev = process.env.isDev

export const errorLog = (error, partErrors = false, withoutSentry = false) => {
  if (getLocalSentry() && not(withoutSentry) && not(partErrors)) {
    getLocalSentry().captureException(error)
  }
  if (isDev) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}

export const initSentry = async () => {
  let Sentry = getSentry()
  if (!SENTRY_DSN) return

  if (!Sentry) {
    try {
      Sentry = await import('@sentry/browser')
    } catch (err) {
      return
    }
  }

  if (eq(getDsn(), SENTRY_DSN)) return

  const client = new Sentry.BrowserClient({
    dsn: SENTRY_DSN,
    integrations: [
      ...Sentry.defaultIntegrations,
      new Sentry.Integrations.GlobalHandlers({
        onerror: false,
        onunhandledrejection: false,
      }),
    ],
    sampleRate: SENTRY_SAMPLE_RATE,
    debug: isDev,
    allowUrls: [getHostname()],
    beforeSend(event, hint) {
      if (isDev) {
        // eslint-disable-next-line no-console
        console.log('beforeSend -> ', event, hint)
        return null
      }

      return event
    },
  })
  const hub = new Sentry.Hub(client)

  if (!window.SpeechKit) {
    window.SpeechKit = {}
  }

  window.SpeechKit.Sentry = {
    configureScope(configureFn) {
      hub.run(currentHub => {
        currentHub.configureScope(configureFn)
      })
    },
    captureException(error) {
      hub.run(currentHub => {
        currentHub.captureException(error)
      })
    },
    captureMessage(message) {
      hub.run(currentHub => {
        currentHub.captureMessage(message)
      })
    },
  }
}

const setupSentry = ({ publisherId, projectId }) => {
  // Set us Sentry Scope
  if (getLocalSentry()) {
    const configure = merge(defaultConfigure, {
      publisher_id: publisherId,
      project_id: projectId,
    })

    getLocalSentry().configureScope(setTags(configure))
  }
}

export default setupSentry
