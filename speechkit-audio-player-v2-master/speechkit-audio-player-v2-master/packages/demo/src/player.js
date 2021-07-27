/* eslint-disable import/no-unresolved */
import { useEffect } from '@storybook/client-api'
import { deepMerge } from '@speechkit/speechkit-audio-player-core/utils'
import SpeechKit from '@speechkit/speechkit-audio-player-v2/build/esm'
import { params } from './config'
import { clearStyles } from './utils'

let playerInst

export const player = () => {
  useEffect(() => {
    SpeechKit.player(deepMerge(params, {
      renderNode: 'speechkit-player-1',
      publisherColor: '#c2185b',
      vastAdTag: null,
      podcast: {
        ad_disabled: true,
      },
    })).then(appInst => {
      playerInst = appInst
    })

    return () => {
      if (playerInst) {
        clearStyles()
        playerInst.destroy()
        playerInst.$destroy()
        playerInst = null
      }
    }
  })

  return `
    <div id="speechkit-player-1"></div>
  `
}

export const playerWithAds = () => {
  useEffect(() => {
    SpeechKit.player(deepMerge(params, { renderNode: 'speechkit-player-2' })).then(appInst => {
      playerInst = appInst
    })

    return () => {
      if (playerInst) {
        clearStyles()
        playerInst.destroy()
        playerInst.$destroy()
        playerInst = null
      }
    }
  })

  return `
    <div id="speechkit-player-2"></div>
  `
}
