import rng from './rng'
import bytesToUuid from './bytesToUuid'

const v4 = () => {
  const rnds = rng()
  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  // eslint-disable-next-line no-bitwise
  rnds[6] = (rnds[6] & 0x0f) | 0x40
  // eslint-disable-next-line no-bitwise
  rnds[8] = (rnds[8] & 0x3f) | 0x80

  return bytesToUuid(rnds)
}

export default v4
