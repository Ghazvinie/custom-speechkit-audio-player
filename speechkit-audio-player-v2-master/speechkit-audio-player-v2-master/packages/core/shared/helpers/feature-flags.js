import { trim } from '../../utils'

export const getFeatureFlags = (flags = '') => (
  trim`${flags}`.split(',')
)
