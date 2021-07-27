((win) => {
  if (win.spktHelper) return;
  win.spktHelper = true;

  const isSetHeights = {}
  const getIframes = function (index) {
    const listIfr = document.querySelectorAll('iframe#speechkit-io-iframe')
    const listIfrArr = Array.from(listIfr)
    return (index !== undefined && listIfrArr[index]) ? listIfrArr[index] : listIfrArr
  }

  const domReady = callback => {
    document.readyState === "interactive" || document.readyState === "complete"
      ? callback()
      : document.addEventListener("DOMContentLoaded", callback);
  };

  // Get CMP details from publisher (function avail on window object)

  const setIframeDisplay = (index, display) => {
    try {
      getIframes(index).style.display = display;
    } catch (e) {}
  };

  const setIframeHeight = (index, height) => {
    try {
      getIframes(index).style.height = height
    } catch (e) {}
  }

  const updateAttributes = (index, data) => {
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
  };

  const makeSrc = (src, cb) => {
    let newSrc = src
    // code to detect new webkit browser & pass articleUrl (see: #S-56)
    const webkit = /AppleWebKit\/([\d.]+)/.exec(navigator.userAgent);
    if (webkit) {
      const webkitVersion = parseFloat(webkit[1]);
      // check if new version of webkit, eg. Safari 12+
      if (webkitVersion > 605) {
        var outerPageUrl = window.location.href;
        // Only append URL on non-dashboard players- see caching issue #S-89
        if (!outerPageUrl.includes('my.speechkit.io')) {
          // get params from the iframe URL (if there are any)
          const iframeUrl = new URL(newSrc);
          let params = new URLSearchParams(iframeUrl);
          if(params.set) {
            // set/add articleUrl param with page URL
            params.set('articleUrl', outerPageUrl);
            // add updated params to the iframe src
            newSrc = src + '?' + params.toString();
          }
        }
      }
    }
    //TODO: This can be moved to within player once we move ad after title
    // if CMP data present, append to URL
    if (!win.__cmp) {
      return cb(newSrc)
    }

    window.__cmp('getConsentData', null, (result, success) => {
      if (success) {
        const oGDPR = {
          // consentData contains the base64-encoded consent string
          consentData: result.consentData,
          // gdprApplies specifies whether the user is in EU jurisdiction
          gdprApplies: result.gdprApplies,
        };

        const sData = btoa(JSON.stringify(oGDPR));
        if(sData) {
          const iframeSrc = new URL(newSrc);
          let oParams = new URLSearchParams(iframeSrc);
          if(oParams.set) {
            // set/add articleUrl param with page URL
            oParams.set('cmp', sData);
            // add updated params to the iframe src
            newSrc = newSrc + '?' + oParams.toString();
          }
        }
      }
      cb(newSrc)
    });
  }

  domReady(() => {
    const listIfrArr = getIframes()
    if (!listIfrArr.length) return

    win.addEventListener(
      "message",
      evt => {
        const ifrIndex = listIfrArr.findIndex(function (ifr) {
          // eslint-disable-next-line eqeqeq
          return ifr.contentWindow == evt.source || ifr.contentWindow == evt.source.parent
        })

        if (ifrIndex === -1) return
        // if (process.env.ORIGINS.indexOf(evt.origin) === -1) return;

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
      },
      false
    );

    listIfrArr.filter(ifr => !!ifr.getAttribute('data-src')).forEach((ifr, idx) => {
      const src = ifr.getAttribute('data-src')
      makeSrc(src, resSrc => {
        ifr.setAttribute('src', resSrc)
      })
      setIframeDisplay(idx, 'block')
    })
  });
})(window);
