import memoizeOne from 'memoize-one'
import { ifProp } from '@speechkit/speechkit-audio-player-core/utils'

export const memSpeedRate =
  memoizeOne(rate => `x${String(rate).replace('.', '_')}`)

export const getPublisherColor = ({
  publisherColor,
  useDarkModeScheme,
  publisherDmColor,
}) => ifProp(useDarkModeScheme, publisherDmColor, publisherColor)

export const getPublisherBgColor = ({
  publisherBgColor,
  useDarkModeScheme,
  publisherDmBgColor,
}) => ifProp(useDarkModeScheme, publisherDmBgColor, publisherBgColor)

export const makeColorVar = color => `--sk-color_${color}`
