import { merge, assocPath } from '@speechkit/speechkit-audio-player-core/utils'

const defaultProps = {
  width: '32px',
  height: '32px',
  viewBox: '0 0 32 32',
  groupProp: {
    stroke: 'none',
    'stroke-width': '1',
    fill: 'none',
    'fill-rule': 'evenodd',
  },
  paths: [
    'M16 0C7.18 0 0 7.18 0 16s7.18 16 16 16 16-7.18 16-16S24.82 0 16 0zm0 30C8.28 30 2 23.72 2 16S8.28 2 16 2s14 6.28 14 14-6.28 14-14 14z',
  ],
  pathsProps: [],
}

export const addPath = (path, props = defaultProps) => assocPath(['paths', 1], path, props)

export const mergeWithDefault = obj => merge(defaultProps, obj)
