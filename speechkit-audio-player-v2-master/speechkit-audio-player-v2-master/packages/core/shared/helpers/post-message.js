const postMessage = (data, stringify = false) => {
  if (window.parent) {
    const dataString = stringify ? JSON.stringify(data) : data
    window.parent.postMessage(dataString, '*')
  }
}

export default postMessage
