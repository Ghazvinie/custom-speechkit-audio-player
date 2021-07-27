// to get parameter from javascript src URL
const getURLParameter = name => decodeURIComponent((
  new RegExp(`[?|&]${name}=([^&;]+?)(&|#|;|$)`)
    .exec(window.location.search) || ['', ''])[1].replace(/\+/g, '%20')) || null

export default getURLParameter
