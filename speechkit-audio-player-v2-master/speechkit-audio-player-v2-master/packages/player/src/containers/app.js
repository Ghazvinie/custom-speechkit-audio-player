import NativePlayer from '@speechkit/speechkit-audio-player-core/media/native'
import { isSupportNativeHLS } from '@speechkit/speechkit-audio-player-core/shared/constants/media'
import { initSentry, errorLog } from '@speechkit/speechkit-audio-player-core/shared/errorTracking'
import { merge, not } from '@speechkit/speechkit-audio-player-core/utils'

import createAppStore from '../store'
import { initApp, destroyApp } from '../actions/app'
import { defaultParams } from '../constants/player'
import { getApp } from '../selectors'
import {
  takeDefault,
  getAppBox,
  getMapApp,
  getProvider,
} from './helpers'

const initPlayer = async params => {
  const {
    renderNode,
    UIEnabled,
    sdkEnabled,
    ...otherParams
  } = merge(defaultParams, params)
  const { store, destroy: destroyStore } = createAppStore()
  const { dispatch, getState } = store
  let appInst = {}
  let playerInstResolve

  if (not(isSupportNativeHLS)) {
    playerInstResolve = await import('@speechkit/speechkit-audio-player-core/media/hls')
  }
  const Player = takeDefault(playerInstResolve || { default: NativePlayer })
  await dispatch(initApp(merge(otherParams, { Player, sdkEnabled })))
  const appProps = getApp(getState())

  if (UIEnabled && appProps.isReady) {
    const [Provider, AppBox, mapApp] = await Promise.all([
      getProvider(),
      getAppBox(appProps),
      getMapApp(appProps),
    ])
    const useGlobalStyleReset = appProps.isIframe
    const useChangeColorScheme = (appProps.isDemo || appProps.publisherDm)

    appInst = new Provider({
      target: document.getElementById(renderNode),
      props: {
        store,
        AppBox,
        mapApp,
        useGlobalStyleReset,
        dispatch,
        useChangeColorScheme,
      },
    })
  }

  appInst.destroy = () => {
    dispatch(destroyApp())
    destroyStore()
  }
  if (sdkEnabled) {
    appInst.appStore = store
  }

  return appInst
}

export default async params => {
  try {
    await initSentry()
    return await initPlayer(params)
  } catch (err) {
    errorLog(err)
    return null
  }
}
