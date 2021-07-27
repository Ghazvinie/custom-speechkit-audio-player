import { mergeWithDefault } from '../helpers'

export const skipNextTrack = mergeWithDefault({
  width: '24px',
  height: '24px',
  viewBox: '0 0 24 24',
  paths: [
    'M0 0h24v24H0z',
    'M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z',
  ],
  pathsProps: [
    'fill: none',
    'fill: currentColor;',
  ],
})
