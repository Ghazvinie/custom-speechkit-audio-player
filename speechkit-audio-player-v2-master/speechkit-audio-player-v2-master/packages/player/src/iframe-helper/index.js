/* eslint-disable no-underscore-dangle */
/* Iframe helper: independent file loaded outside of iframe */
/* -> Communicates with the player inside the iframe and passes necessary info */
import http from '@speechkit/speechkit-audio-player-core/shared/http'
import {
  curry, keys, encodeURIComp, listen, pathOr,
  not, ifProp, noop, eq, parseInt, merge,
} from '@speechkit/speechkit-audio-player-core/utils'
import {
  makeSrc,
  asyncForEach,
  domReady,
  getProjectData,
} from './utils'
import { ORIGINS, skBackend } from './constants'
import initGtagAnalytics, {
  checkShouldUseGaFeature,
  addToDataSet,
  checkGtagIsFunction,
  checkWithoutSpktGA,
} from './analytics'
import { PLAYER_TYPE } from '../constants/player'

(win => {
  if (win.spktHelper) return
  // eslint-disable-next-line no-param-reassign
  win.spktHelper = true
  // eslint-disable-next-line prefer-destructuring
  const isDev = process.env.isDev

  const isSetHeights = {}
  let listIfrArr

  const getIframes = index => {
    if (!listIfrArr) {
      const listIfr = document.querySelectorAll('iframe#speechkit-io-iframe')
      listIfrArr = Array.from(listIfr)
    }
    return (index !== undefined && listIfrArr[index]) ? listIfrArr[index] : listIfrArr
  }

  // Get CMP details from publisher (function avail on window object)
  const setStyleParam = curry((name, index, value) => {
    try {
      getIframes(index).style[name] = value
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`for ${name}`, e)
    }
  })
  const setIframeDisplay = setStyleParam('display')
  const setIframeHeight = setStyleParam('height')

  const updateAttributes = (index, data) => {
    const iframe = getIframes(index)
    if (!iframe) return
    keys(data.attrs).forEach(attr => {
      if (data.attrs[attr]) {
        if (attr === 'onload' && !isSetHeights[index]) {
          return
        }
        iframe.setAttribute(attr, data.attrs[attr])
      }
    })
  }

  domReady(() => {
    const listIframes = getIframes()
    if (!listIframes.length) return

    const handlePostMessages = evt => {
      let ifrIndex = -1
      for (let i = 0; i < listIframes.length; i += 1) {
        const ifr = listIframes[i]
        if (evt && evt.source
          // eslint-disable-next-line eqeqeq
          && (ifr.contentWindow == evt.source || ifr.contentWindow == evt.source.parent)
        ) {
          ifrIndex = i
          break
        }
      }

      if (ifrIndex === -1) return
      if (!isDev && ORIGINS.indexOf(evt.origin) === -1) return

      const data = evt[evt.message ? 'message' : 'data']

      if (data && data.msg && data.msg === 'iframe-resize') {
        setIframeHeight(ifrIndex, data.attrs.height)
        isSetHeights[ifrIndex] = true
        return
      }

      if (data && data.attrs) {
        updateAttributes(ifrIndex, data)
        return
      }

      if (data === 'sk-fail') {
        setIframeDisplay(ifrIndex, 'none')
      } else if (data === 'sk-success') {
        setIframeDisplay(ifrIndex, 'block')
        const ifr = getIframes(ifrIndex)
        if (ifr) {
          ifr.contentWindow.postMessage({ msg: 'iframe-helper', data: { test: 'data' } }, '*')
        }
      } else if (Array.isArray(data) && data[0] === 'event') {
        if (checkGtagIsFunction()) {
          // eslint-disable-next-line no-undef
          gtag(...data)
          return
        }
        addToDataSet(...data)
      }
    }

    listen(win, 'message', handlePostMessages, false)

    // eslint-disable-next-line prefer-destructuring
    const articleUrl = encodeURIComp(ifProp(!isDev, window.location.href, process.env.articleUrl))
    const ifrWithDataSrc = listIfrArr.filter(ifr => !!ifr.getAttribute('data-src'))
    const eqTypePlaylist = eq(PLAYER_TYPE.playlist)
    const makeConfigUrl = (projectId, type) => {
      if (eqTypePlaylist(type)) {
        return `${skBackend}/cf/${projectId}?type=${type}`
      }

      return `${skBackend}/cf/${projectId}?article_url=${articleUrl}`
    }
    const pathOrNull = pathOr(null)
    const getPodcastId = pathOrNull(['podcast', 'podcast_id'])
    const getMedia = pathOrNull(['podcast', 'media'])

    asyncForEach(ifrWithDataSrc, async (ifr, idx) => {
      const src = ifr.getAttribute('data-src')
      try {
        const { status } = await http.get(src)
        const nStatus = parseInt(status)
        if (not(nStatus >= 200 && nStatus < 300)) {
          throw new Error('Bad status')
        }
      } catch (err) {
        setIframeDisplay(idx, 'none')
        return
      }
      const { id: projectId, type } = getProjectData(src) || {}
      const makeSrcWithWin = makeSrc(win)

      if (projectId) {
        try {
          const { data } = await http.get(makeConfigUrl(projectId, type))
          let srcForIrf = `${skBackend}/p/${projectId}`

          if (not(eqTypePlaylist(type))) {
            const podcastId = getPodcastId(data)
            const media = getMedia(data)
            if (not(podcastId && media.length)) return
            srcForIrf = `${skBackend}/e/${podcastId}`
          }
          ifr.setAttribute('src', await makeSrcWithWin(srcForIrf))

          if (data.gtagSettings && checkShouldUseGaFeature(data.featureFlags)) {
            initGtagAnalytics(merge(data.gtagSettings, {
              withoutSpktGA: checkWithoutSpktGA(data.featureFlags),
            }))
          }
        } catch (e) {
          setIframeDisplay(idx, 'none')
        }
      } else {
        ifr.setAttribute('src', await makeSrcWithWin(src))
      }
    }).catch(noop)
  })
})(window)
