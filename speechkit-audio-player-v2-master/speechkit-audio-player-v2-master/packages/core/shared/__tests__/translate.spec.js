/* eslint-env jest */
import translate from '../translate'
import { TRANSLATION_KEYS } from '../locales/constants'
import LOCALES from '../locales'

describe('@speechkit/speechkit-audio-player-core/shared/translate', () => {
  describe('translate()', () => {
    const testEnValue = LOCALES.en[TRANSLATION_KEYS.title]
    const testEnDeafultValue = LOCALES.en[TRANSLATION_KEYS.copyright]
    const testDeValue = LOCALES.de[TRANSLATION_KEYS.title]

    it('should return function', () => {
      const f = translate()
      expect(f).toBeInstanceOf(Function)
      expect(f.length).toEqual(1)
    })

    it(`should return ${testEnValue} if key - 'title' and lang - 'en' | null | 'xx'`, () => {
      expect(translate()('title')).toEqual(testEnValue)
      expect(translate('en')('title')).toEqual(testEnValue)
      expect(translate('xx')('title')).toEqual(testEnValue)
    })

    it(`should return ${testDeValue} if key - 'title' and lang - 'de'`, () => {
      expect(translate('de')('title')).toEqual(testDeValue)
      expect(translate()('title')).toEqual(testEnValue)
    })

    it(`should return ${testEnDeafultValue} if key - 'copyright' and lang - 'de'`, () => {
      expect(translate('de')('copyright')).toEqual(testEnDeafultValue)
      expect(translate('de')('title')).toEqual(testDeValue)
    })
  })
})
