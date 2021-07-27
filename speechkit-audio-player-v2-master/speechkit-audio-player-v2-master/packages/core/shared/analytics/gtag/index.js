import { gtmSearch } from './helpers'
import {
  compose,
  pick,
  not,
  isTopWindow,
  merge,
  ifProp,
} from '../../../utils'

const pickIds = picked => compose(
  _ => Object.values(_).filter(id => !!id),
  pick(picked),
)

const initWithoutIframeHelper = gtagSettings => {
  gtmSearch(merge({
    pageLocation: window.location.href,
    disableClientStorage: not(isTopWindow()),
  }, gtagSettings))
}

const pickedIds = ['id', 'pId']

export const gtagInit = ({ gtagSettings, isIframe }) => {
  if (!gtagSettings) return []

  if (not(isIframe)) {
    initWithoutIframeHelper(gtagSettings)
  }

  const { withoutSpktGA } = gtagSettings
  const pickGtagIds = pickIds(
    ifProp(withoutSpktGA, pickedIds.slice(1), pickedIds),
  )

  return pickGtagIds(gtagSettings)
}
