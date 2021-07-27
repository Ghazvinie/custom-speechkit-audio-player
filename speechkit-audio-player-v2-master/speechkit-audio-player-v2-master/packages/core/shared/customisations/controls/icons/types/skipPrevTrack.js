import { mergeWithDefault } from '../helpers'

export const skipPrevTrack = mergeWithDefault({
  width: '12px',
  height: '12px',
  viewBox: '0 0 12 12',
  paths: [
    'M0 0h2v12H0V0zm3.5 6l8.5 6V0L3.5 6z',
  ],
  pathsProps: [
    'fill: currentColor;',
  ],
})
