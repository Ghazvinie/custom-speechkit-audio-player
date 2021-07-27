/* eslint-env jest */
import { getEventBackendUrl, getAnalyticsUrl } from '../eventTracker/helpers'
import {
  localUrl,
  stagingUrl,
  prodUrl,
} from '../eventTracker/constants'

describe('event-tracker', () => {
  describe('getEventBackendUrl()', () => {
    it('should return local url if skBackend equals spkt.local', () => {
      expect(getEventBackendUrl({ skBackend: `http://${localUrl}`, analyticsUrl: null }))
        .toEqual('http://spkt.local:5000/events-development')
      expect(getEventBackendUrl({ skBackend: `http://${localUrl}`, analyticsUrl: 'https://websitename.com' }))
        .toEqual('http://spkt.local:5000/events-development')
    })

    it(`should return default prod url if skBackend equals ${prodUrl} and analyticsUrl don't set`, () => {
      expect(getEventBackendUrl({ skBackend: prodUrl, analyticsUrl: null }))
        .toEqual('https://happen.spkt.io/events')
    })

    it(`should return specific prod url if skBackend equals ${prodUrl} and analyticsUrl is set`, () => {
      expect(getEventBackendUrl({ skBackend: prodUrl, analyticsUrl: 'https://websitename.com' }))
        .toEqual('https://websitename.com/events')
      expect(getEventBackendUrl({ skBackend: prodUrl, analyticsUrl: 'https://otherwebsitename.com' }))
        .toEqual('https://otherwebsitename.com/events')
    })

    it(`should return default staging url if skBackend equals ${stagingUrl} and analyticsUrl don't set`, () => {
      expect(getEventBackendUrl({ skBackend: stagingUrl, analyticsUrl: null }))
        .toEqual('https://happen.spkt.io/events-staging')
    })

    it(`should return specific staging url if skBackend equals ${stagingUrl} and analyticsUrl is set`, () => {
      expect(getEventBackendUrl({ skBackend: stagingUrl, analyticsUrl: 'https://websitename.com' }))
        .toEqual('https://websitename.com/events-staging')
      expect(getEventBackendUrl({ skBackend: stagingUrl, analyticsUrl: 'https://otherwebsitename.com' }))
        .toEqual('https://otherwebsitename.com/events-staging')
    })
  })

  describe('getAnalyticsUrl()', () => {
    beforeEach(() => {
      const mGetRandomValues = jest.fn()
        .mockReturnValueOnce([22])
        .mockReturnValueOnce([89])
        .mockReturnValueOnce([12])
        .mockReturnValueOnce([30])
        .mockReturnValue([50])
      Object.defineProperty(window, 'crypto', {
        value: { getRandomValues: mGetRandomValues },
      })
    })
    it('should return one of list AnalyticsUrl', () => {
      expect(getAnalyticsUrl({ analyticsUrls: ['https://websitename.com', 'https://otherwebsitename.com'], traffic: [0.3, 0.7] })).toEqual('https://websitename.com')
      expect(getAnalyticsUrl({ analyticsUrls: ['https://websitename.com', 'https://otherwebsitename.com'], traffic: [0.3, 0.7] })).toEqual('https://otherwebsitename.com')
      expect(getAnalyticsUrl({ analyticsUrls: ['https://websitename.com', 'https://otherwebsitename.com'], traffic: [0.3, 0.7] })).toEqual('https://websitename.com')
      expect(getAnalyticsUrl({ analyticsUrls: ['https://websitename.com', 'https://otherwebsitename.com'], traffic: [0.3, 0.7] })).toEqual('https://otherwebsitename.com')
      expect(getAnalyticsUrl({ analyticsUrls: ['https://websitename.com'], traffic: [1, 0] })).toEqual('https://websitename.com')
      expect(getAnalyticsUrl({ analyticsUrls: ['https://websitename.com'], traffic: [0, 1] })).toEqual(null)
    })

    it('should return null if empty data', () => {
      expect(getAnalyticsUrl({})).toBe(null)
      expect(getAnalyticsUrl()).toBe(null)
    })
  })
})
