import { arrayToHashMap } from '../../utils'

export const DEFAULT_LANG = 'en'

export const TRANSLATION_KEYS = arrayToHashMap([
  'title', 'shortTitle', 'loading', 'playing', 'adsNote', 'adsNote_v2',
  'advertiserNote', 'feedback', 'copyright', 'speechkit', 'minutes',
])
