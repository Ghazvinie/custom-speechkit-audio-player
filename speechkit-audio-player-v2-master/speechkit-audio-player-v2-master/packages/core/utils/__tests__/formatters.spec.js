/* eslint-env jest */
import { formatTime } from '../formatters'

describe('@speechkit/speechkit-audio-player-core/utils/formatters.js', () => {
  describe('formatTime()', () => {
    it('should return formatted time m:ss from seconds', () => {
      expect(formatTime()).toEqual('0:00')
      expect(formatTime(null)).toEqual('0:00')
      expect(formatTime(167)).toEqual('2:47')
      expect(formatTime(7)).toEqual('0:07')
      expect(formatTime(1267)).toEqual('21:07')
    })

    it('should return formatted time mm:ss from seconds', () => {
      expect(formatTime(undefined, { withAdditionalZero: true })).toEqual('00:00')
      expect(formatTime(null, { withAdditionalZero: true })).toEqual('00:00')
      expect(formatTime(167, { withAdditionalZero: true })).toEqual('02:47')
      expect(formatTime(7, { withAdditionalZero: true })).toEqual('00:07')
      expect(formatTime(1267, { withAdditionalZero: true })).toEqual('21:07')
    })

    it('should return formatted time ss from seconds', () => {
      expect(formatTime(null, { onlySeconds: true })).toEqual('0s')
      expect(formatTime(167, { onlySeconds: true })).toEqual('167s')
      expect(formatTime(7, { onlySeconds: true })).toEqual('7s')
      expect(formatTime(1267, { onlySeconds: true })).toEqual('1267s')
    })
  })
})
