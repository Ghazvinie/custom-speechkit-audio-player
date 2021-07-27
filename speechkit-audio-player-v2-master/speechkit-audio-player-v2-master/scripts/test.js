process.env.NODE_ENV = 'test'

const jest = require('jest') // eslint-disable-line import/no-extraneous-dependencies

const argv = process.argv.slice(2)

const hasContinuousIntegrationArg = argv.find(arg => arg === '--ci')

if (process.env.CI) {
  argv.push('--coverage')
  argv.push('--ci')
  argv.push('--runInBand')
  argv.push('--coverageReporters=text-summary')
  argv.push('--coverageReporters=html')
  argv.push('--reporters=default')
  argv.push('--reporters=jest-junit')
  process.env.JEST_JUNIT_OUTPUT_DIR = './reports/junit'
}

if (!process.env.CI && !hasContinuousIntegrationArg) {
  argv.push(process.env.WATCH_ALL ? '--watchAll' : '--watch')
}

jest.run(argv)
