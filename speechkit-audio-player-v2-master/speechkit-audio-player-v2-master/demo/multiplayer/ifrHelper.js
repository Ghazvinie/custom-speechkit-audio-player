(function (win) {
  if (win.spktHelper) return;
  win.spktHelper = true;

  const isSetHeights = {}
  const getIframes = function (index) {
    const listIfr = document.querySelectorAll('iframe#speechkit-io-iframe')
    const listIfrArr = Array.from(listIfr)
    return (index !== undefined && listIfrArr[index]) ? listIfrArr[index] : listIfrArr
  }

  const setIframeDisplay = function (index, display) {
    try {
      getIframes(index).style.display = display
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('error setting iframe display', e)
    }
  }

  const setIframeHeight = function (index, height) {
    try {
      getIframes(index).style.height = height
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('error setting iframe height', e)
    }
  }

  const updateAttributes = function (index, data) {
    const iframe = getIframes(index)
    if (!iframe) return
    Object.keys(data.attrs).forEach(function (attr) {
      if (data.attrs[attr]) {
        if (attr === 'onload' && !isSetHeights[index]) {
          return
        }
        iframe.setAttribute(attr, data.attrs[attr])
      }
    })
  }

  const domReady = function (callback) {
    // eslint-disable-next-line no-unused-expressions
    document.readyState === 'interactive' || document.readyState === 'complete'
      ? callback()
      : document.addEventListener('DOMContentLoaded', callback)
  }

  domReady(function () {
    const listIfrArr = getIframes()
    if (!listIfrArr.length) return

    listIfrArr.filter(function (ifr) { return ifr.getAttribute('data-src') }).forEach(function (ifr, idx) {
      const src = ifr.getAttribute('data-src')
      ifr.setAttribute('src', src)
      setIframeDisplay(idx, 'block')
    })

    win.addEventListener('message', function (evt) {
      const ifrIndex = listIfrArr.findIndex(function (ifr) {
        // eslint-disable-next-line eqeqeq
        return ifr.contentWindow == evt.source || ifr.contentWindow == evt.source.parent
      })

      if (ifrIndex === -1) return

      const key = evt.message ? 'message' : 'data'
      const data = evt[key]

      if (data && data.msg && data.msg === 'iframe-resize') {
        setIframeHeight(ifrIndex, data.attrs.height)
        isSetHeights[ifrIndex] = true
        return
      }

      if (data && data.attrs) {
        updateAttributes(ifrIndex, data)
        return
      }

      if (data === 'sk-fail') {
        setIframeDisplay(ifrIndex, 'none')
      } else if (data === 'sk-success') {
        setIframeDisplay(ifrIndex, 'block')
      }
    }, false)
  })
}(window))
