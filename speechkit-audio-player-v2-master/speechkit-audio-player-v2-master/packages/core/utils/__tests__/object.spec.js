/* eslint-env jest */
import {
  merge,
  deepMerge,
  omit,
  pick,
} from '../object'

describe('@speechkit/speechkit-audio-player-core/utils/object.js', () => {
  describe('merge', () => {
    it('merges the objects together into one object', () => {
      expect(merge({ foo: 1 }, { bar: 2 }, { baz: 3 })).toEqual({ foo: 1, bar: 2, baz: 3 })
    })

    it('gives precedence to later objects in the list', () => {
      expect(merge({ foo: 1 }, { foo: 2 }, { bar: 2 })).toEqual({ foo: 2, bar: 2 })
    })

    it('ignores inherited properties', () => {
      function Foo() {}
      Foo.prototype.bar = 42
      const foo = new Foo()
      expect(merge(foo, { fizz: 'buzz' })).toEqual({ fizz: 'buzz' })
    })
  })

  describe('deepMerge()', () => {
    it('should takes two objects, recursively merges their own properties and returns a new object', () => {
      const a = { w: 1, x: 2, y: { z: 3 } }
      const b = { a: 4, b: 5, c: { d: 6 } }
      expect(deepMerge(a, b)).toEqual({
        w: 1, x: 2, y: { z: 3 }, a: 4, b: 5, c: { d: 6 },
      })
    })

    it('should overrides properties in the first object with properties in the second object', () => {
      const a = { a: { b: 1, c: 2 }, y: 0 }
      const b = { a: { b: 3, d: 4 }, z: 0 }
      expect(deepMerge(a, b)).toEqual({ a: { b: 3, c: 2, d: 4 }, y: 0, z: 0 })
    })

    it('should reports only own properties', () => {
      const a = { w: 1, x: { y: 2 } }
      function Cla() {}
      Cla.prototype.y = 5
      expect(deepMerge({ x: new Cla() }, a)).toEqual({ w: 1, x: { y: 2 } })
      expect(deepMerge(a, { x: new Cla() })).toEqual({ w: 1, x: { y: 2 } })
    })
  })

  describe('omit()', () => {
    it('copies an object omitting the listed properties', () => {
      const obj = {
        a: 1, b: 2, c: 3, d: 4, e: 5, f: 6,
      }

      expect(omit(['a', 'c', 'f'], obj)).toEqual({ b: 2, d: 4, e: 5 })
    })

    it('don\'t include prototype properties', () => {
      // eslint-disable-next-line func-names
      const F = function (param) { this.x = param }
      F.prototype.y = 40
      F.prototype.z = 50
      const obj = new F(30)
      obj.v = 10
      obj.w = 20
      expect(omit(['w', 'x', 'y'], obj)).toEqual({ v: 10 })
    })
  })

  describe('pick()', () => {
    const obj = {
      a: 'a1', b: 'b2', c: 'c3', d: 'd4', e: 'e5', f: 'f6', g: 'g7', 1: 2,
    }

    it('copies the named properties of an object to the new object', () => {
      expect(pick(['a', 'c', 'f', 'e'], obj)).toEqual({
        a: 'a1', c: 'c3', e: 'e5', f: 'f6',
      })
    })

    it('handles numbers as properties', () => {
      expect(pick([1], obj)).toEqual({
        1: 2,
      })
    })

    it('ignores properties not included', () => {
      expect(pick([1, 2, 3, 4, 'a', 'c'], obj)).toEqual({
        1: 2, a: 'a1', c: 'c3',
      })
    })
  })
})
