/* eslint-disable no-console, import/no-unresolved */
import { useEffect } from '@storybook/client-api'
import { deepMerge } from '@speechkit/speechkit-audio-player-core/utils'
import { SpeechKitSdk } from '@speechkit/speechkit-audio-player-v2/build/esm'

let playerInst
const sdkParams = {
  skBackend: 'https://spkt.io',
  UIEnabled: true,
}

const logs = msg => {
  console.log(msg)
}

export const playerWithUi = () => {
  useEffect(() => {
    // The SpeechKit player to initialise with the passed parameters
    SpeechKitSdk.player(deepMerge(sdkParams, {
      projectId: 6673,
      podcastId: 534513,
    }))
      .then(appInst => {
        // The player instance
        playerInst = appInst
        window.AppInst = appInst
        // The interface to get the state of the player
        window.YourApp = {
          // Determine if the player is currently paused
          paused() {
            const result = appInst.paused()
            logs(`fn_paused() -> ${result}`)
          },
          // Get the currentTime (in seconds)
          currentTime() {
            const result = appInst.currentTime()
            logs(`fn_currentTime() -> ${result}`)
          },
          // Get the total duration of the audio
          duration() {
            const result = appInst.duration()
            logs(`fn_duration() -> ${result}`)
          },
          // Get the remaining time of the audio
          remainingTime() {
            const result = appInst.remainingTime()
            logs(`fn_remainingTime() -> ${result}`)
          },
        }
        // Player event handlers
        appInst.events.on(SpeechKitSdk.Events.play, dataEvent => {
          console.log(`on -> ${SpeechKitSdk.Events.play} -> `, dataEvent)
        })
        appInst.events.on(SpeechKitSdk.Events.pause, dataEvent => {
          console.log(`on -> ${SpeechKitSdk.Events.pause} -> `, dataEvent)
        })
        appInst.events.on(SpeechKitSdk.Events.timeUpdate, dataEvent => {
          console.log(`on -> ${SpeechKitSdk.Events.timeUpdate} -> `, dataEvent)
        })
        appInst.events.on(SpeechKitSdk.Events.ended, () => {
          console.log(`on -> ${SpeechKitSdk.Events.ended}`)
        })
        appInst.events.on(SpeechKitSdk.Events.playbackRate, dataEvent => {
          console.log(`on -> ${SpeechKitSdk.Events.playbackRate} -> `, dataEvent)
        })
      })

    return () => {
      if (playerInst) {
        // Destroy the player instance if needed
        playerInst.destroy()
        playerInst = null
      }
    }
  })

  return `
    <div>
      <div id="speechkit-player"></div>
      <!-- Your the controls for play with SDK -->
      <p>Custom controls</p>
      <div class="test-sdk-ctrl">
        <!-- Begin playback of the audio -->
        <button onclick="AppInst.play()">play()</button>
        <!-- Pause audio playback -->
        <button onclick="AppInst.pause()">pause()</button>
        <button onclick="YourApp.paused()">paused()</button>
        <button onclick="YourApp.currentTime()">currentTime()</button>
        <button onclick="YourApp.duration()">duration()</button>
        <button onclick="YourApp.remainingTime()">remainingTime()</button>
      </div>
      <!-- <div class="test-sdk-logs"></div> -->
    </div>
  `
}

export const playerWithoutUi = () => {
  useEffect(() => {
    // The SpeechKit player to initialise with the passed parameters
    SpeechKitSdk.player(deepMerge(sdkParams, {
      projectId: 6673,
      podcastId: 534513,
      UIEnabled: false,
    })).then(appInst => {
      // The player instance
      playerInst = appInst
      window.AppInst = appInst
      // The interface to get the state of the player
      window.YourApp = {
        // Determine if the player is currently paused
        paused() {
          const result = appInst.paused()
          logs(`fn_paused() -> ${result}`)
        },
        // Get the currentTime (in seconds)
        currentTime() {
          const result = appInst.currentTime()
          logs(`fn_currentTime() -> ${result}`)
        },
        // Get the total duration of the audio
        duration() {
          const result = appInst.duration()
          logs(`fn_duration() -> ${result}`)
        },
        // Get the remaining time of the audio
        remainingTime() {
          const result = appInst.remainingTime()
          logs(`fn_remainingTime() -> ${result}`)
        },
      }
      // Player event handlers
      appInst.events.on(SpeechKitSdk.Events.play, dataEvent => {
        console.log(`on -> ${SpeechKitSdk.Events.play} -> `, dataEvent)
      })
      appInst.events.on(SpeechKitSdk.Events.pause, dataEvent => {
        console.log(`on -> ${SpeechKitSdk.Events.pause} -> `, dataEvent)
      })
      appInst.events.on(SpeechKitSdk.Events.timeUpdate, dataEvent => {
        console.log(`on -> ${SpeechKitSdk.Events.timeUpdate} -> `, dataEvent)
      })
      appInst.events.on(SpeechKitSdk.Events.ended, () => {
        console.log(`on -> ${SpeechKitSdk.Events.ended}`)
      })
      appInst.events.on(SpeechKitSdk.Events.playbackRate, dataEvent => {
        console.log(`on -> ${SpeechKitSdk.Events.playbackRate} -> `, dataEvent)
      })
    })

    return () => {
      if (playerInst) {
        // Destroy the player instance if needed
        playerInst.destroy()
        playerInst = null
      }
    }
  })

  return `
    <div>
      <div id="speechkit-player"></div>
      <p>Custom controls</p>
      <!-- Your controls to play with the SDK -->
      <div class="test-sdk-ctrl">
        <!-- Start audio playback -->
        <button onclick="AppInst.play()">play()</button>
        <!-- Pause audio playback -->
        <button onclick="AppInst.pause()">pause()</button>
        <button onclick="YourApp.paused()">paused()</button>
        <button onclick="YourApp.currentTime()">currentTime()</button>
        <button onclick="YourApp.duration()">duration()</button>
        <button onclick="YourApp.remainingTime()">remainingTime()</button>
      </div>
      <!-- <div class="test-sdk-logs"></div> -->
    </div>
  `
}
