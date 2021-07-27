/* eslint-env jest */
import { noop } from '../function'

describe('@speechkit/speechkit-audio-player-core/utils/function.js', () => {
  describe('noop()', () => {
    it('should return undefined', () => {
      expect(noop()).toEqual(undefined)
    })

    it('should return undefined if passed the args', () => {
      expect(noop(1)).toEqual(undefined)
      expect(noop(null)).toEqual(undefined)
      expect(noop('test')).toEqual(undefined)
      expect(noop({ foo: 'foo', bar: 'bar' })).toEqual(undefined)
    })
  })
})
