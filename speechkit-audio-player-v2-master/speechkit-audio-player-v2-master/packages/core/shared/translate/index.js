import memoizeOne from 'memoize-one'
import LOCALES from '../locales'
import { DEFAULT_LANG } from '../locales/constants'
import { pathOr, path, keys } from '../../utils'

export const LANGUAGES = keys(LOCALES)

export const defineLanguage = (language = DEFAULT_LANG) => {
  const lang = language.toLowerCase().replace('-', '_')

  if (LANGUAGES.includes(lang)) {
    return lang
  }

  const [short_lang] = lang.split('_')

  if (LANGUAGES.includes(short_lang)) {
    return short_lang
  }

  return DEFAULT_LANG
}

const translate = memoizeOne(language => {
  const lang = defineLanguage(language)

  return key => (
    pathOr(path([DEFAULT_LANG, key], LOCALES), [lang, key], LOCALES)
  )
})

export default translate
