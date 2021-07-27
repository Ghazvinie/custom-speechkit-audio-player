import {
  arrayToHashMap,
  canPlayType,
  ifProp,
  not,
  isAndroidOS,
  isUnknownOS,
} from '../../utils'

export const MEDIA_TYPE_HLS = 'application/vnd.apple.mpegurl'

export const CONTENT_TYPE = {
  hls: 'application/x-mpegURL', // default content type
  mp3: 'audio/mpeg', // fallback to mp3
}

export const MEDIA_TYPE = arrayToHashMap([
  'podcast', 'preroll',
])

export const isSupportNativeHLS = (
  canPlayType(MEDIA_TYPE_HLS)
  && not(isAndroidOS() || isUnknownOS())
)

export const getPreferredContentType = canPlayHls => ifProp(
  (isSupportNativeHLS || canPlayHls),
  CONTENT_TYPE.hls,
  CONTENT_TYPE.mp3,
)

export const MediaElementEvents = [
  'loadedmetadata', 'canplaythrough', 'ended', 'play',
  'playing', 'pause', 'timeupdate', 'progress', 'durationchange',
]

export const MediaElementEventsMap = arrayToHashMap(MediaElementEvents)

export const DEFAULT_PLAYBACK_RATE = 1.0
