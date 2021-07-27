/* IE11-ONLY:START */
import 'core-js'
import 'regenerator-runtime/runtime'
/* IE11-ONLY:END */
import { postMessageTypesPub as postMessageTypes } from '@speechkit/speechkit-audio-player-core/shared/analytics/constants'
import player from './containers/app'
import SpeechKitSdk from './sdk'

const SpeechKit = {
  player,
  sdk: SpeechKitSdk,
  postMessageTypes,
  version: process.env.version,
}
window.SpeechKit = SpeechKit

export { default as SpeechKitSdk } from './sdk'

export default SpeechKit
