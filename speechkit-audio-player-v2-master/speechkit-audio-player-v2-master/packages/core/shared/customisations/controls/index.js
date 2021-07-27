import { eq } from '../../../utils'
import { PUBLISHERS } from '../../constants/customisations'

export const getCustomisationsControls = async publisherId => {
  const publisherIdEq = eq(publisherId)
  if (publisherIdEq(PUBLISHERS.kicker)) {
    const { default: customControl } = await import('./kicker')
    return customControl
  }
  if (publisherIdEq(PUBLISHERS.maisonModerne)) {
    const { default: customControl } = await import('./maison-moderne')
    return customControl
  }

  return null
}
