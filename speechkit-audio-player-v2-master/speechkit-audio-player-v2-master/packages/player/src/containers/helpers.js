import { not, prop } from '@speechkit/speechkit-audio-player-core/utils'

export const takeDefault = prop('default')

export const getAppBox = async ({
  isPlaylist,
  useUIv2,
  isPodcastPlayer,
  isSanofi,
  isMemi,
}) => {
  if (isPlaylist) {
    return takeDefault(await import('./../kit/box/ui-playlist.svelte'))
  }
  if (useUIv2) {
    if (isSanofi) {
      return takeDefault(await import('./../kit/box/ui-podcast-v3.svelte'))
    }
    if (isPodcastPlayer && not(isMemi)) {
      return takeDefault(await import('./../kit/box/ui-podcast-v2.svelte'))
    }

    return takeDefault(await import('./../kit/box/ui-v2.svelte'))
  }

  return takeDefault(await import('./../kit/box/ui-v1.svelte'))
}

export const getMapApp = async ({ isPlaylist }) => {
  if (isPlaylist) {
    return takeDefault(await import('./mappers/playlist-app'))
  }

  return takeDefault(await import('./mappers/default-app'))
}

export const getProvider = async () => (
  takeDefault(await import('../kit/box/provider.svelte'))
)
