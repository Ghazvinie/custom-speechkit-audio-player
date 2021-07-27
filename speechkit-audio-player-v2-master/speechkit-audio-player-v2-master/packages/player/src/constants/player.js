export const PLAYER_TYPE = {
  minimal: 'MinimalPlayer',
  playlist: 'PlaylistPlayer',
}

export const VISIBLE_ITEMS = 4

export const defaultParams = {
  player: PLAYER_TYPE.minimal,
  skBackend: process.env.skBackend,
  renderNode: 'speechkit-player',
  publisherColor: '#000000',
  publisherBgColor: '#F5F5F5',
  publisherDm: false,
  publisherDmColor: '#FFFFFF',
  publisherDmBgColor: 'transparent',
  language: 'en_GB',
  sdkEnabled: false,
  UIEnabled: true,
  isIframe: false,
  isDemo: false,
  visibleItems: VISIBLE_ITEMS,
  // TODO: remove it after test
  gtagSettings: null,
}

export const EVENTS_MAP = {
  play: 'play',
  pause: 'pause',
  timeUpdate: 'timeUpdate',
  playbackRate: 'playbackRate',
  ended: 'ended',
}

export const whiteListAppParams = [
  'skBackend', 'apiKey', 'projectId', 'projectCampaignId', 'podcastUrl', 'publisherId', 'publisher',
  'publisherLogo', 'publisherColor', 'language', 'articleUrl', 'feedbackUrl', 'message', 'isAmp',
  'withDownloadButton', 'podcast', 'podcasts', 'vastAdTag', 'customAdMedia', 'isIframe', 'isDemo',
  'featureFlags', 'publisherBgColor', 'player', 'visibleItems', 'gtagSettings', 'isPodcastPlayer',
  'playlist', 'publisherDm', 'publisherDmColor', 'publisherDmBgColor',
]

export const demoPodcastUrl = 'https://speechkit-development.s3.amazonaws.com/audio/previews/de/gc/de-DE-Wavenet-B.mp3'

export const demoPodcast = {
  title: 'Audio',
  published_at: Date.now(),
  media: [{
    content_type: 'audio/mpeg',
    url: demoPodcastUrl,
    duration: 3,
  }],
}

export const spktURL = 'https://bit.ly/33Q3Bsf'

export const speedRateVariants = [1, 1.25, 1.5, 2, 0.5]

export const DEFAULT_SEEK = 10
