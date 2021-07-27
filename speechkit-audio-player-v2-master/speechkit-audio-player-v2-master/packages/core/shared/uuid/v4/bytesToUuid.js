/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
import { makeEmptyArray } from '../../../utils'

const byteToHex = makeEmptyArray(255).map(i => (i + 0x100).toString(16).substr(1))

const splitPos = [3, 5, 7, 9]

const bytesToUuid = buf => buf.slice(0, 16).reduce((acc, next, idx) => (
  acc.concat(splitPos.includes(idx) ? [byteToHex[next], '-'] : [byteToHex[next]])
), []).join('')

export default bytesToUuid
