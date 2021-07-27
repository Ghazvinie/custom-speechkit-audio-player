const arrElements = [
  'dm', 'color', 'bgColor', 'dmColor', 'dmBgColor',
]
const elementsRef = {}

const listen = (node, event, handler, options) => {
  node.addEventListener(event, handler, options)
  return () => node.removeEventListener(event, handler, options)
}

const handleChangeColour = dispatch => evt => {
  const {
    target: {
      id,
      type,
      value,
      checked,
    },
  } = evt

  if (type === 'checkbox') {
    dispatch({ [id]: checked })
    return
  }

  dispatch({ [id]: value })
}

const init = dispatch => {
  arrElements.forEach(id => {
    const node = document.querySelector(`#${id}`)
    elementsRef[id] = {
      node,
      remove: listen(node, 'change', handleChangeColour(dispatch)),
    }
  })
}

export default init
