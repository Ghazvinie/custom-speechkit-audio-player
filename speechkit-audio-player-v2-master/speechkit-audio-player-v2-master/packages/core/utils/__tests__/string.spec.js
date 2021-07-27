/* eslint-env jest */
import {
  trim,
  decamelize,
  camelize,
  firstLetterToUpperCase,
  assocUrlParam,
} from '../string'

describe('@speechkit/speechkit-audio-player-core/utils/string.js', () => {
  describe('trim()', () => {
    it('should return trimming for string', () => {
      const color = '#ffffff'

      expect(trim`
        color: #ff00ff;
      `).toEqual('color:#ff00ff;')
      expect(trim`
        color: ${color};
      `).toEqual('color:#ffffff;')
      expect(trim`
        color: ${color};
        background-color: ${color};
      `).toEqual('color:#ffffff;background-color:#ffffff;')
    })
  })

  describe('decamelize()', () => {
    it('should return decamelize for string', () => {
      expect(decamelize('podcastId')).toEqual('podcast_id')
      expect(decamelize('externalId')).toEqual('external_id')
      expect(decamelize('articleUrl')).toEqual('article_url')
      expect(decamelize('some_params')).toEqual('some_params')
    })
  })

  describe('camelize()', () => {
    it('should return camelize for string', () => {
      expect(camelize('podcast_id')).toEqual('podcastId')
      expect(camelize('external_id')).toEqual('externalId')
      expect(camelize('article_url')).toEqual('articleUrl')
      expect(camelize('ad_link_click')).toEqual('adLinkClick')
      expect(camelize('someParams')).toEqual('someParams')
    })
  })

  describe('uppercaseFirstLetter()', () => {
    it('should makes first letter to uppercase', () => {
      expect(firstLetterToUpperCase('color')).toEqual('Color')
      expect(firstLetterToUpperCase('Color')).toEqual('Color')
      expect(firstLetterToUpperCase('the test string')).toEqual('The test string')
    })
  })

  describe('assocUrlParam()', () => {
    const url = 'https://speechkit-development.s3.amazonaws.com/audio/previews/de/gc/de-DE-Wavenet-B.mp3'
    it('should adds GET params to URL', () => {
      const url1 = assocUrlParam(url, 'dvc', 'spkt')
      expect(url1).toEqual(`${url}?dvc=spkt`)
      expect(assocUrlParam(url1, 't', '1')).toEqual(`${url1}&t=1`)
    })
  })
})
