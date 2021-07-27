import { listen } from '@speechkit/speechkit-audio-player-core/utils'

const mouseEvents = ['mouseenter', 'mouseleave']

const handleMouseHover = node => ({ type }) => {
  node.dispatchEvent(new CustomEvent('hover', {
    detail: { isMouseEnter: type === mouseEvents[0] },
  }))
}

const mouseHoverable = node => {
  const handleMouseHoverWithNode = handleMouseHover(node)
  const listeners = mouseEvents.map(evt => listen(node, evt, handleMouseHoverWithNode))

  return {
    destroy() {
      listeners.forEach(listener => listener())
    },
  }
}

export default mouseHoverable
