/* eslint-disable no-underscore-dangle */
import {
  listen, has, curry,
} from '@speechkit/speechkit-audio-player-core/utils'
import { PLAYER_TYPE } from '../constants/player'

export const domReady = callback => {
  if (['interactive', 'complete'].includes(document.readyState)) {
    callback()
    return
  }

  listen(document, 'DOMContentLoaded', callback)
}

const getProjectIdForPlaylist = src => {
  const [match = false, group = ''] = /\/{2}[\w.:]{2,}\/p\/([\d]+)[/]*/.exec(src) || []
  return match ? group : null
}

export const getProjectData = src => {
  const playlistProjectId = getProjectIdForPlaylist(src)
  if (playlistProjectId) return { type: PLAYER_TYPE.playlist, id: playlistProjectId }

  const [match = false, group = ''] = /\/projects\/(.*)\/podcasts/.exec(src) || []
  return match ? { type: PLAYER_TYPE.minimal, id: group } : null
}

export const asyncForEach = async (array, callback) => {
  await array.reduce(async (memo, item, index) => {
    await memo
    await callback(item, index, array)
  }, undefined)
}

export const makeSrc = curry((win, src) => new Promise(resolve => {
  let newSrc = src
  // code to detect new webkit browser & pass articleUrl (see: #S-56)
  const webkit = /AppleWebKit\/([\d.]+)/.exec(navigator.userAgent)
  if (webkit) {
    const webkitVersion = parseFloat(webkit[1])
    // check if new version of webkit, eg. Safari 12+
    if (webkitVersion > 605) {
      const outerPageUrl = win.location.href
      // Only append URL on non-dashboard players- see caching issue #S-89
      if (!outerPageUrl.includes('my.speechkit.io')) {
        // get params from the iframe URL (if there are any)
        const iframeUrl = new URL(src)
        const params = new URLSearchParams(iframeUrl)
        if (params.set) {
          // set/add articleUrl param with page URL
          params.set('articleUrl', outerPageUrl)
          // add updated params to the iframe src
          newSrc = `${src}?${params.toString()}`
        }
      }
    }
  }
  // TODO: This can be moved to within player once we move ad after title
  // if CMP data present, append to URL
  if (!has('__cmp', win)) {
    return resolve(newSrc)
  }

  win.__cmp('getConsentData', null, (result, success) => {
    if (success) {
      const oGDPR = {
        // consentData contains the base64-encoded consent string
        consentData: result.consentData,
        // gdprApplies specifies whether the user is in EU jurisdiction
        gdprApplies: result.gdprApplies,
      }

      const sData = btoa(JSON.stringify(oGDPR))
      if (sData) {
        const iframeSrc = new URL(newSrc)
        const oParams = new URLSearchParams(iframeSrc)
        if (oParams.set) {
          // set/add articleUrl param with page URL
          oParams.set('cmp', sData)
          // add updated params to the iframe src
          newSrc = `${newSrc}?${oParams.toString()}`
        }
      }
    }
    resolve(newSrc)
  })
}))
