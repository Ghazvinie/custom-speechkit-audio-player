/* eslint-env jest */
import {
  is, isString, isTrue, isFalse,
} from '../checkers'

describe('@speechkit/speechkit-audio-player-core/utils/checkers.js', () => {
  describe('is()', () => {
    it('should return TRUE if val is VALID type', () => {
      expect(is(String, '')).toBe(true)
      expect(is(Array, [])).toBe(true)
      expect(is(Object, {})).toBe(true)
    })

    it('should return FALSE if val is INVALID type', () => {
      expect(is(String, 0)).toBe(false)
      expect(is(Array, '')).toBe(false)
      expect(is(Object, null)).toBe(false)
    })
  })

  describe('isString()', () => {
    it('should return TRUE if val is sting', () => {
      expect(isString('')).toBe(true)
      expect(isString(`${''}`)).toBe(true)
      expect(isString(String(''))).toBe(true)
    })

    it('should return FALSE if val is NOT sting', () => {
      expect(isString({})).toBe(false)
      expect(isString(112)).toBe(false)
      expect(isString(() => {})).toBe(false)
      expect(isString(null)).toBe(false)
      expect(isString(undefined)).toBe(false)
    })
  })

  describe('isTrue()', () => {
    it('should return TRUE if the value looks like true', () => {
      expect(isTrue(true)).toBe(true)
      expect(isTrue('true')).toBe(true)
      expect(isTrue(1)).toBe(true)
      expect(isTrue('1')).toBe(true)
    })

    it('should return FALSE if the value does not look like true', () => {
      expect(isTrue(false)).toBe(false)
      expect(isTrue('false')).toBe(false)
      expect(isTrue('0')).toBe(false)
      expect(isTrue('something')).toBe(false)
      expect(isTrue()).toBe(false)
      expect(isTrue(null)).toBe(false)
      expect(isTrue(undefined)).toBe(false)
    })
  })

  describe('isFalse()', () => {
    it('should return TRUE if the value looks like false', () => {
      expect(isFalse(false)).toBe(true)
      expect(isFalse('false')).toBe(true)
      expect(isFalse('0')).toBe(true)
      expect(isFalse(0)).toBe(true)
      expect(isFalse('something')).toBe(true)
      expect(isFalse()).toBe(true)
      expect(isFalse(null)).toBe(true)
      expect(isFalse(undefined)).toBe(true)
    })

    it('should return FALSE if the value does not look like false', () => {
      expect(isFalse(true)).toBe(false)
      expect(isFalse('true')).toBe(false)
      expect(isFalse(1)).toBe(false)
      expect(isFalse('1')).toBe(false)
    })
  })
})
