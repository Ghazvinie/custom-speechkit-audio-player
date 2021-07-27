import postMessage from '../helpers/post-message'
import { isTopWindow } from '../../utils'
import { addToDataSet, checkGtagIsFunction } from './gtag/helpers'

const gtagCommand = 'event'

const dataLayerEventPush = (eventName, eventOption) => {
  if (checkGtagIsFunction()) {
    // eslint-disable-next-line no-undef
    gtag(gtagCommand, eventName, eventOption)
    return
  }
  addToDataSet(gtagCommand, eventName, eventOption)
  if (!isTopWindow()) {
    postMessage([gtagCommand, eventName, eventOption])
  }
}

export default dataLayerEventPush
