/* eslint-env jest */
import { checkIsPodcastPlayer } from '../customisations'

describe('@speechkit/speechkit-audio-player-core/shared/customisations', () => {
  describe('checkIsPodcastPlayer()', () => {
    const params = { isPodcastPlayer: true, projectId: 1112, featureFlags: 'ga_feature, ui_v1' }
    const concatFeatureFlags = featureFlags => ({
      ...params,
      featureFlags: `${params.featureFlags}${featureFlags}`,
    })
    const testFn = (flags = '', expectedResult) => (
      expect(checkIsPodcastPlayer(concatFeatureFlags(flags))).toBe(expectedResult)
    )

    describe('should return true if is a podcast player', () => {
      it('when used flag for all projects', () => {
        testFn(',podcast_like', true)
      })

      it('when used special named flag for all projects', () => {
        testFn(',podcast_like, podcast_like_sanofi', true)
      })

      it('when used flag with ID for one project', () => {
        testFn(',podcast_like, podcast_like_1112', true)
        testFn(',podcast_like, podcast_like_1112', true)
      })

      it('when used flags with IDs for a lot of projects', () => {
        testFn(',podcast_like,podcast_like_1112,podcast_like_2221', true)
        testFn(',podcast_like,podcast_like_2221, podcast_like_1112, other_flag', true)
      })
    })

    describe('should return false if isn\'t a podcast player', () => {
      it('when didn\'t use flag', () => {
        testFn('', false)
        testFn('podcast_like_11124', false)
      })

      it('when used flag with ID for a different project', () => {
        testFn(', podcast_like, podcast_like_11124', false)
      })

      it('when used a flag with typo', () => {
        testFn(', podcast_like, podcast_like_', false)
        testFn(', podcast_like, podcast_like_other_name', false)
      })
    })
  })
})
