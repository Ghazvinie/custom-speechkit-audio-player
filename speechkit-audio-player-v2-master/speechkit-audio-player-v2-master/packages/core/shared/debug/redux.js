import * as createLogger from 'redux-logger'

// eslint-disable-next-line no-underscore-dangle
const logger = ({ ignoredActionInLogs }) => createLogger.__moduleExports.createLogger({
  predicate: (getState, { type }) => (
    !ignoredActionInLogs.map(item => item.getType()).includes(type)
  ),
})

export default logger
