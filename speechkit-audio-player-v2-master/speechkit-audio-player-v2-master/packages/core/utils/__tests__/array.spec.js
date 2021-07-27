/* eslint-env jest */
import { arrayToHashMap, insertItem } from '../array'

describe('@speechkit/speechkit-audio-player-core/utils/array.js', () => {
  describe('arrayToHashMap()', () => {
    it('should return empty Object if argument is not Array', () => {
      expect(arrayToHashMap()).toEqual({})
      expect(arrayToHashMap(undefined)).toEqual({})
      expect(arrayToHashMap(null)).toEqual({})
      expect(arrayToHashMap('')).toEqual({})
      expect(arrayToHashMap({})).toEqual({})
      expect(arrayToHashMap(1)).toEqual({})
    })

    it('should return hashMap if argument is Array', () => {
      expect(arrayToHashMap([1, 2, 3])).toEqual({ 1: 1, 2: 2, 3: 3 })
      expect(arrayToHashMap(['foo', 'bar', 'some', 'foo-bar']))
        .toEqual({
          foo: 'foo',
          bar: 'bar',
          some: 'some',
          'foo-bar': 'foo-bar',
        })
    })
  })

  describe('insertItem()', () => {
    it('should insert an element in needs the position', () => {
      expect(insertItem(22, 1, [0, 1, 2, 3])).toEqual([0, 22, 1, 2, 3])
      expect(insertItem(22, 0, [0, 1, 2, 3])).toEqual([22, 0, 1, 2, 3])
      expect(insertItem(22, 3, [0, 1, 2, 3])).toEqual([0, 1, 2, 22, 3])
      expect(insertItem(22, 4, [0, 1, 2, 3])).toEqual([0, 1, 2, 3, 22])
      expect(insertItem(22, 5, [0, 1, 2, 3])).toEqual([0, 1, 2, 3, 22])
    })
  })
})
