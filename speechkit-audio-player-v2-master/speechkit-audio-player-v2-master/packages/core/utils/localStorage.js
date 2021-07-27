import { errorLog } from '../shared/errorTracking'
import { ifProp } from './checkers'

const lStorage = (win => {
  let ls = false

  const polyfillLocalStorage = () => {
    try {
      if (typeof win.localStorage === 'object') {
        try {
          localStorage.setItem('localStorage', '1')
          localStorage.removeItem('localStorage')
        } catch (e) {
          let dataStorage = {}
          try {
            Storage.prototype.setItem = (id, val) => { dataStorage[id] = String(val) }
            Storage.prototype.getItem = id => (
              ifProp(dataStorage.hasOwnProperty.call(dataStorage, id), dataStorage[id], null)
            )
            Storage.prototype.removeItem = id => { delete dataStorage[id] }
            Storage.prototype.clear = () => { dataStorage = {} }
          } catch (err) {
            errorLog(`Error trying to polyfill localStorage ${err}`, true, true)
            return
          }
        }
        ls = true
      }
    } catch (err) {
      if ((err.toString() || '').includes('SecurityError')) return
      errorLog(`Error trying to polyfill localStorage ${err}`, true, true)
    }
  }

  polyfillLocalStorage()

  return {
    getLSValue(key) {
      if (!ls) return null

      try {
        return JSON.parse(localStorage.getItem(key)) || null
      } catch (err) {
        errorLog(`Error trying get to localStorage ${err}`, true, true)
        return null
      }
    },
    setLSValue(key, value) {
      if (!ls) return null

      try {
        return localStorage.setItem(key, JSON.stringify(String(value)))
      } catch (err) {
        errorLog(`Error trying set to localStorage ${err}`, true, true)
        return null
      }
    },
  }
})(window)

export default lStorage
