/* eslint-env jest */
import { roundFloat, getRandomInt } from '../number'

describe('@speechkit/speechkit-audio-player-core/utils/number.js', () => {
  describe('roundFloat()', () => {
    it('should return 0 if value NaN', () => {
      expect(roundFloat(Number.NaN)).toEqual(0)
    })

    it('should return 102.12 if value 102.120013', () => {
      expect(roundFloat(102.120013)).toEqual(102.12)
    })

    it('should return 0.67 if value 2 / 3', () => {
      expect(roundFloat(2 / 3)).toEqual(0.67)
    })

    it('should return 0.6667 if value 2 / 3 and fixed = 4', () => {
      expect(roundFloat(2 / 3, 4)).toEqual(0.6667)
    })

    it('should return 20 if value 20.005', () => {
      expect(roundFloat(20.005)).toEqual(20)
    })

    it('should return 20.01 if value 20.006', () => {
      expect(roundFloat(20.006)).toEqual(20.01)
    })

    it('should return 20.001 if value 20.001 and fixed = 4', () => {
      expect(roundFloat(20.001, 4)).toEqual(20.001)
    })

    it('should return 20.001 if value \'20.001\' and fixed = 4', () => {
      expect(roundFloat('20.001', 4)).toEqual(20.001)
    })
  })

  describe('getRandomInt()', () => {
    it('should return random value between 1 & 100', () => {
      const value = getRandomInt(1, 100)
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(100)
    })

    it('should return random value between 1 & 10', () => {
      const value = getRandomInt(1, 10)
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(10)
    })

    it('should return random value between 10 & 50', () => {
      const value = getRandomInt(10, 50)
      expect(value).toBeGreaterThanOrEqual(10)
      expect(value).toBeLessThanOrEqual(50)
    })
  })
})
