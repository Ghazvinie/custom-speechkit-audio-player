import http from '@speechkit/speechkit-audio-player-core/shared/http'
import {
  isArray, notNil, not, isObject,
  has, keys, prop,
} from '@speechkit/speechkit-audio-player-core/utils'
import { errorLog } from '@speechkit/speechkit-audio-player-core/shared/errorTracking'
import { checkIsPlaylist } from './helpers'

const mapKeys = {
  podcastId: 'id',
  externalId: 'ext_id',
}
const availableKeys = keys(mapKeys)

const requestPlaylist = ({ skBackend, projectId }, podcasts = []) => (
  http.post(`${skBackend}/cfp/${projectId}`, {
    body: { podcasts },
  })
)

export const checkExtendPlaylist = ({ playlist, ...otherParams }) => (
  checkIsPlaylist(otherParams) && isArray(playlist) && playlist.length
)

const takeParamsForRequest = ({ playlist }) => playlist.reduce((acc, next) => {
  if (isObject(next)) {
    const key = availableKeys.find(item => has(item, next))

    if (not(key)) return acc

    const propKey = prop(key)
    return acc.concat([{ [propKey(mapKeys)]: propKey(next) }])
  }

  return acc
}, [])

export const getPlaylist = async params => {
  if (not(checkExtendPlaylist(params))) return null

  try {
    const playlist = takeParamsForRequest(params)
    if (not(playlist.length)) return null

    const { data } = await requestPlaylist(params, playlist)
    if (data.length) return data.filter(item => notNil(item))
  } catch (e) {
    errorLog(new Error('Can\'t get the playlist'), true)
    return null
  }
}
