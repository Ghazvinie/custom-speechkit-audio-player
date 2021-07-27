import { mergeWithDefault } from '../helpers'

export const pauseMin = mergeWithDefault({
  width: '20px',
  height: '20px',
  viewBox: '6 6 20 20',
  paths: [
    'M14.5 10.5h-3c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1zm-1 9h-1v-7h1v7zm7-9h-3c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1zm-1 9h-1v-7h1v7z',
  ],
  pathsProps: [
    'fill: currentColor;',
  ],
})
