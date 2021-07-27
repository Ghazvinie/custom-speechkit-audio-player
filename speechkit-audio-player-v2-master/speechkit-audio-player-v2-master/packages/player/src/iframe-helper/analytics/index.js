/* eslint-disable no-param-reassign, eqeqeq */
import { gtmSearch } from '@speechkit/speechkit-audio-player-core/shared/analytics/gtag/helpers'
import { isTopWindow } from '@speechkit/speechkit-audio-player-core/utils'

const initGtagAnalytics = (gtagSettings = {}) => {
  if (!isTopWindow()) return // helper works only top
  gtmSearch({ pageLocation: window.location.href, ...gtagSettings })
}

export {
  checkShouldUseGaFeature,
  addToDataSet,
  checkGtagIsFunction,
  checkWithoutSpktGA,
} from '@speechkit/speechkit-audio-player-core/shared/analytics/gtag/helpers'

export default initGtagAnalytics
