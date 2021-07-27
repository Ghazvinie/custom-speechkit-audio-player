import { mergeWithDefault } from '../helpers'

export const skLogo = mergeWithDefault({
  width: '12px',
  height: '14px',
  viewBox: '0 0 12 14',
  paths: [
    'M0 0v4.093l6.694 4.463H12V0zM0 14l6-4.348-6-4.208z',
  ],
  pathsProps: [
    'fill: var(--sk-text-color);',
  ],
})
