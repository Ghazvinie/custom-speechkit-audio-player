import { mergeWithDefault } from '../helpers'

export const pauseV2 = mergeWithDefault({
  width: '32px',
  height: '32px',
  viewBox: '0 0 32 32',
  paths: [
    'M8,25.333 h5.333 V6.667 H8 v18.666 zM18.667,6.667 v18.666 H24 V6.667 h-5.333 z',
  ],
  pathsProps: [
    'fill: currentColor;',
  ],
})
