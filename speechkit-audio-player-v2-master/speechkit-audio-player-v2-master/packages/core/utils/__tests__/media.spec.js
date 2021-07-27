/* eslint-env jest */
import { canPlayType } from '../media'
import { MEDIA_TYPE_HLS } from '../../shared/constants/media'

describe('@speechkit/speechkit-audio-player-core/utils/array.js', () => {
  describe('canPlayType()', () => {
    beforeEach(() => {
      global.Audio.prototype.canPlayType = jest.fn().mockImplementationOnce(() => 'maybe')
    })

    it('should return TRUE if native support HLS', () => {
      expect(canPlayType(MEDIA_TYPE_HLS)).toBe(true)
    })

    it('should return FALSE if NOT support HLS', () => {
      canPlayType(MEDIA_TYPE_HLS)
      expect(canPlayType(MEDIA_TYPE_HLS)).toBe(false)
    })
  })
})
