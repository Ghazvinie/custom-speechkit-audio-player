import postMessage from '../helpers/post-message'

let timeoutId

const resetTimeout = () => {
  if (timeoutId) {
    window.clearTimeout(timeoutId)
    timeoutId = null
  }
}

const postCurrentHeight = isAmp => {
  resetTimeout()
  const body = document.querySelector('body')
  const { height } = body.getBoundingClientRect()

  if (!height) {
    timeoutId = window.setTimeout(() => {
      postCurrentHeight(isAmp)
    }, 100)
    return
  }

  try {
    postMessage({
      msg: 'iframe-resize',
      attrs: { height: `${height}px` },
    })

    // resize-messages to need JSON stringify
    const resizeMessages = [{
      src: window.location.toString(),
      context: 'iframe.resize',
      height,
    }]

    if (isAmp) {
      resizeMessages.push({
        sentinel: 'amp',
        type: 'embed-size',
        height: height > 100 ? height : 100,
      })
    }
    resizeMessages.forEach(msg => postMessage(msg, true))
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
  }
}

export default postCurrentHeight
