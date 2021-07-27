// embed script tag into page for script src
const loadScript = async src => new Promise((resolve, reject) => {
  // TODO: check if Google Ad and resolve
  const script = document.createElement('script')
  let ready = false
  script.type = 'text/javascript'
  script.src = src
  script.async = true
  script.onerror = e => {
    // eslint-disable-next-line no-console
    console.log('adswizz inject error: ', JSON.stringify(e))
    reject(e, script)
  }
  // eslint-disable-next-line no-multi-assign
  script.onload = script.onreadystatechange = () => {
    if (!ready && (!script.readyState || script.readyState === 'complete')) {
      ready = true
      resolve()
    }
  }
  document.body.appendChild(script)
})

export default loadScript
