((win) => {
  if (win.spktHelper) return;
  win.spktHelper = true;

  const isSetHeights = {}
  let listIfrArr
  const getIframes = function (index) {
    if (!listIfrArr) {
      const listIfr = document.querySelectorAll('iframe#speechkit-io-iframe')
      listIfrArr = []
      for(let i = 0; i < listIfr.length; i++) {
        listIfrArr.push(listIfr[i])
      }
    }
    return (index !== undefined && listIfrArr[index]) ? listIfrArr[index] : listIfrArr
  }

  const fetchOptions = {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json; charset=UTF-8',
    },
  }

  const getResponseData = response => response.text().then(text => {
    const contentType = response.headers.get('Content-Type')
    const responseData = {
      text,
      json: null,
    }

    if (contentType && contentType.includes('application/json')) {
      try {
        responseData.json = JSON.parse(text)
      } catch (e) {
        responseData.json = null
      }
    }

    return responseData
  })

  const asyncForEach = async (array, callback) => {
    for (let i = 0; i < array.length; i++) {
      await callback(array[i], i, array)
    }
  }

  const getProjectId = (src) => {
    const [ match = false, group = '' ] = /\/projects\/(.*)\/podcasts/.exec(src) || []
    return match ? group : null
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

  const makeSrc = src => new Promise(resolve => {
    let newSrc = src
    // code to detect new webkit browser & pass articleUrl (see: #S-56)
    const webkit = /AppleWebKit\/([\d.]+)/.exec(navigator.userAgent);
    if (false && webkit) {
      const webkitVersion = parseFloat(webkit[1]);
      // check if new version of webkit, eg. Safari 12+
      if (webkitVersion > 605) {
        var outerPageUrl = win.location.href;
        // Only append URL on non-dashboard players- see caching issue #S-89
        if (!outerPageUrl.includes('my.speechkit.io')) {
          // get params from the iframe URL (if there are any)
          const iframeUrl = new URL(src);
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
      return resolve(newSrc)
    }

    win.__cmp('getConsentData', null, (result, success) => {
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
      resolve(newSrc);
    });
  });

  domReady(() => {
    const listIfrArr = getIframes()
    if (!listIfrArr.length) return

    win.addEventListener(
      "message",
      evt => {
        let ifrIndex = -1;
        for(let i = 0; i < listIfrArr.length; i++) {
          const ifr = listIfrArr[i];
          // eslint-disable-next-line eqeqeq
          if (ifr.contentWindow == evt.source || ifr.contentWindow == evt.source.parent) {
            ifrIndex = i;
            break;
          }
        }

        if (ifrIndex === -1) return;
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

    const articleUrl = encodeURIComponent(window.location.href)

    asyncForEach(listIfrArr.filter(ifr => !!ifr.getAttribute('data-src')), async (ifr, idx) => {
      const src = ifr.getAttribute('data-src')
      const projectId = getProjectId(src)

      if (projectId) {
        const { data: { podcast_id } } = await fetch(`https://spkt.io/s/${projectId}/${articleUrl}`, fetchOptions)
          .then(response => (
            Promise.all([response, getResponseData(response)])
          ))
          .then(([response, data]) => {
            response.data = data.json || data.text
            if (!response.ok) {
              setIframeDisplay(idx, 'none')
              throw response
            }
            return response
          })

        if (podcast_id) {
          const resSrc = await makeSrc(`https://spkt.io/a/${podcast_id}`)
          ifr.setAttribute('src', resSrc)
        } else {
          setIframeDisplay(idx, 'none')
        }
      } else {
        console.log('call -> for -> src -> ', src)
        const resSrc = await makeSrc(src)
        ifr.setAttribute('src', resSrc)
      }
    }).catch((e) => {
      console.error(e)
    })
  });
})(window);
