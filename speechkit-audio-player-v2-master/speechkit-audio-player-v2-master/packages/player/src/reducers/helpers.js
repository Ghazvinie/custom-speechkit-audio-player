import { merge, assoc } from '@speechkit/speechkit-audio-player-core/utils'

export const simplePayloadMerge = (state, { payload }) => merge(state, payload)
export const assocTrue = name => assoc(name, true)
export const assocFalse = name => assoc(name, false)
