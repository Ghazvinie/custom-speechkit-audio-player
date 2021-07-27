// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
const getRandomValues = (typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto))
  // eslint-disable-next-line no-undef
  || (typeof msCrypto !== 'undefined' && typeof window.msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto))

const rng = getRandomValues
  ? () => {
    const rnds8 = new Uint8Array(16) // eslint-disable-line no-undef
    getRandomValues(rnds8)
    return rnds8
  }
  : () => {
    const rnds = new Array(16)

    // eslint-disable-next-line no-plusplus
    for (let i = 0, r; i < 16; i++) {
      // eslint-disable-next-line no-bitwise
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000
      // eslint-disable-next-line no-bitwise,no-mixed-operators
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff
    }

    return rnds
  }

export default rng
