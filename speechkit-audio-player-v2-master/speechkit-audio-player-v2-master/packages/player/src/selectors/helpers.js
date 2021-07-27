import { createSelectorCreator } from 'reselect'
import memoizeOne from 'memoize-one'
import {
  compose,
  curry,
  eq,
  find,
  has,
  prop,
  toArray,
  head,
  isArray,
  pickAll,
  keys,
  merge,
  ifProp,
  assoc,
  assocUrlParam,
} from '@speechkit/speechkit-audio-player-core/utils'

export const memoizeOneCreateSelector = createSelectorCreator(memoizeOne)

const getPreferredMedia = curry((type, media) => compose(
  find(compose(eq(type), prop('content_type'))),
  toArray,
)(media))

const podcastFieldsMap = {
  id: 'externalId',
  podcast_id: 'id',
  title: 'title',
  author: 'author',
  published_at: 'publishedAt',
}

const pickMeta = compose(
  _ => keys(_).reduce((acc, next) => {
    const propNext = prop(next)
    return assoc(propNext(podcastFieldsMap), propNext(_), acc)
  }, {}),
  pickAll(keys(podcastFieldsMap)),
)

export const getMediaPodcast = (type, { podcasts }, isPodcast) => {
  if (isArray(podcasts) && podcasts.length) {
    return podcasts.filter(podcast => has('media', podcast)).map(podcast => {
      const { media } = podcast
      const ifIsPodcast = ifProp(isPodcast)
      const meta = ifIsPodcast(pickMeta(podcast), null)
      const mediaItem = getPreferredMedia(type, media) || head(media)
      const preferredMedia = ifIsPodcast(
        assoc('url', assocUrlParam(prop('url', mediaItem), 'dvc', 'spkt'), mediaItem),
        mediaItem,
      )

      return merge(preferredMedia, { meta })
    })
  }

  return null
}
