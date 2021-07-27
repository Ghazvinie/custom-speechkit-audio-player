import {
  ifProp,
  trim,
  compose,
  merge,
  omit,
  not,
  map,
} from '../../../utils'
import { getFeatureFlags } from '../../helpers/feature-flags'
import { featureFlagsMap } from '../../constants/customisations'

// eslint-disable-next-line prefer-destructuring
const isDev = process.env.isDev
let countWaiting = 0

const createScript = () => (
  document.createElement('script')
)

const appendScript = (scriptEl, root = 'body') => {
  document.querySelector(root).appendChild(scriptEl)
}

const dataSets = []
let allowWriteToDataSets = true

export const checkGtagIsFunction = () => (
  typeof gtag === 'function'
)

export const addToDataSet = (...args) => {
  if (!allowWriteToDataSets) return
  dataSets.push([...args])
}

const fillDataLayer = () => {
  if (not(checkGtagIsFunction())) {
    setTimeout(fillDataLayer, 200)
    return
  }

  allowWriteToDataSets = false
  dataSets.forEach(data => {
    // eslint-disable-next-line no-undef
    gtag(...data)
  })
  dataSets.length = 0
}

export const getGtmList = () => compose(
  _ => _.filter(({ src }) => src.indexOf('id=') !== -1),
  Array.from,
)(document.querySelectorAll('script[src*=googletagmanager\\.com]'))

const ifFalseEmptyString = (cond, value) => ifProp(cond, value, '')

const addGtagConfig = ({
  id, pageLocation, enableSendPageViews, disableClientStorage,
}) => (trim`
  gtag('config', '${id}', {
    ${ifFalseEmptyString(pageLocation, `'page_location': '${pageLocation}',`)}
    ${ifFalseEmptyString(enableSendPageViews, `'send_page_view': '${enableSendPageViews}',`)}
    ${ifFalseEmptyString(disableClientStorage, '\'client_storage\': \'none\',')}
    ${ifFalseEmptyString(isDev, '\'debug_mode\': true,')}
  });
`)

export const addGtagSnippet = ({
  id,
  pId,
  enableSendPageViews,
  pageLocation = null,
  withInitDataLayer = true,
  disableClientStorage = false,
  withoutSpktGA = false,
}) => {
  const scriptEl = createScript()
  const initDataLayer = ifFalseEmptyString(withInitDataLayer, `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
  `)
  const defaultParams = { id, pageLocation, disableClientStorage }
  const spktGtagConfig =
    ifFalseEmptyString(not(withoutSpktGA), addGtagConfig(defaultParams))
  const pubGtagConfig =
    ifFalseEmptyString(pId, addGtagConfig(merge(defaultParams, { id: pId, enableSendPageViews })))

  scriptEl.text = `
    ${initDataLayer}
    ${spktGtagConfig}
    ${pubGtagConfig}
  `
  appendScript(scriptEl)
  fillDataLayer()
}

export const addGtagScript = gtagSettings => {
  const { id, pId, withoutSpktGA } = gtagSettings
  const gtagId = ifProp(withoutSpktGA && pId, pId, id)
  const scriptEl = createScript()
  scriptEl.async = true
  scriptEl.type = 'text/javascript'
  scriptEl.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}&l=dataLayer`
  appendScript(scriptEl, 'head')
  addGtagSnippet(gtagSettings)
}

const getGtagId = ({ src }) => {
  const [match = false, group = ''] = /[?|&]id=([\w-]*)/.exec(src) || []
  return match ? group : null
}

export const checkShouldUseGaFeature = featureFlags => (
  getFeatureFlags(featureFlags).includes(featureFlagsMap.gaFeature)
)

export const checkWithoutSpktGA = featureFlags => (
  getFeatureFlags(featureFlags).includes(featureFlagsMap.disabled_gaSk)
)

export const gtmSearch = gtagSettings => {
  if (not(gtagSettings && gtagSettings.id)) return
  const gtmList = getGtmList()
  const docIsReady = document.readyState === 'complete'

  if (gtmList.length) {
    const { pId, withoutSpktGA } = gtagSettings
    const gtagIds = map(getGtagId, gtmList)
    const hasPublisherId = gtagIds.includes(pId)
    if (withoutSpktGA && hasPublisherId) return

    addGtagSnippet(merge(
      // NOTE: add checker for dataLayer
      { withInitDataLayer: not(checkGtagIsFunction()) },
      ifProp(
        hasPublisherId,
        omit(['pId'], gtagSettings),
        gtagSettings,
      ),
    ))
    return
  }

  if (docIsReady && gtmList.length === 0) {
    // waiting to add gtm to the parent page
    if (gtagSettings.pId && countWaiting < 10) {
      countWaiting += 1
      return setTimeout(() => {
        gtmSearch(gtagSettings)
      }, 200)
    }
    addGtagScript(gtagSettings)
    return
  }

  if (docIsReady) {
    gtmSearch(gtagSettings)
  }
}
