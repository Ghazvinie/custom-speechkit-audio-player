/* eslint-env jest */
/* eslint-disable import/no-extraneous-dependencies */
// import 'svelte-jester'
import crypto from 'crypto'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

Object.defineProperty(window, 'crypto', {
  writable: true,
  value: {
    getRandomValues: arr => crypto.randomBytes(arr.length),
  },
})
