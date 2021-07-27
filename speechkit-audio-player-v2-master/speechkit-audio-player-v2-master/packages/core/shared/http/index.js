import { merge, deepMerge } from '../../utils'

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

const defaultOptions = {
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json; charset=UTF-8',
  },
}

const defaultConfig = {
  shouldStringifyBody: true,
}

const http = () => {
  const request = (url, option = {}, config = {}) => {
    const mergedOptions = deepMerge(defaultOptions, option)
    const mergedConfig = merge(defaultConfig, config)

    if (mergedOptions.body && mergedConfig.shouldStringifyBody) {
      mergedOptions.body = JSON.stringify(mergedOptions.body)
    }

    return fetch(url, mergedOptions)
      .then(response => (
        Promise.all([response, getResponseData(response)])
      ))
      .then(([response, data]) => {
        response.data = data.json || data.text
        if (!response.ok) {
          throw response
        }
        return response
      })
  }

  return {
    async get(url, option = {}, config) {
      return request(url, merge({ method: 'GET' }, option), config)
    },
    async post(url, option = {}, config) {
      return request(url, merge({ method: 'POST' }, option), config)
    },
  }
}

export const makeHeaderWithToken = token => ({
  headers: {
    Authorization: `Token token=${token}`,
  },
})

export default http()
