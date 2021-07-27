/* eslint-disable import/no-unresolved */
import { useEffect } from '@storybook/client-api'
import SpeechKit from '@speechkit/speechkit-audio-player-v2/build/esm'
import { clearStyles } from './utils'

const isDev = process.env.NODE_ENV === 'development'
let playerInst

const erasePlayer = renderNode => {
  if (playerInst) {
    clearStyles()
    playerInst.destroy()
    playerInst.$destroy()
    playerInst = null
  }
}

export const player = () => {
  useEffect(() => {
    if (document.getElementById('speechkit-player-playlist').children.length) {
      erasePlayer()
    }

    SpeechKit.player({
      renderNode: 'speechkit-player-playlist',
      player: 'PlaylistPlayer',
      projectId: isDev ? 3311 : 6673,
    }).then(app => {
      playerInst = app
    }).catch(err => {
      console.error(err)
    })

    return () => {
      erasePlayer()
    }
  }, [])

  return `
    <div id="speechkit-player-playlist"></div>
  `
}
