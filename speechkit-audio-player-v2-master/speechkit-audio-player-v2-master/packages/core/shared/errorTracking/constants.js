export const SENTRY_DSN = process.env.sentryDsn
export const SENTRY_SAMPLE_RATE = process.env.isDev ? 1 : 0.2

export const defaultConfigure = {
  environment: process.env.NODE_ENV,
  version: process.env.version,
  build_type: process.env.buildType,
}
