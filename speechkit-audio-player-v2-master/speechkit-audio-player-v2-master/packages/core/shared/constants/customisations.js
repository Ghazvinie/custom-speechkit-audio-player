import { arrayToHashMap } from '../../utils'

export const PUBLISHERS = {
  forbes: 3265,
  kicker: 5332,
  nettavisen: 4148,
  jfm0: 363,
  jfm1: 6674,
  maisonModerne: 6574,
  sanofi: 6583,
  memi: 4619,
}

export const featureFlagsMap = arrayToHashMap([
  'hideFeedback',
  'hideSKLink',
  'customControls',
  'ui_v2',
  'gaFeature',
  'podcast_like',
  'podcast_like_sanofi',
  'disabled_uuids',
  'disabled_gaSk',
])
