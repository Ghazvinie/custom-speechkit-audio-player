import uuidV4 from 'uuid/v4'
import { merge, getDeviceType, not } from '../../utils'
import http from '../http'
import { MEDIA_TYPE } from '../constants/media'
import { errorLog } from '../errorTracking'
import { getUserId, getEventBackendUrl } from './helpers'

const eventTracker = (options = {}) => {
  const {
    projectId,
    publisherId,
    projectCampaignId,
    withoutUuids,
  } = options
  const eventBackendUrl = getEventBackendUrl(options)
  const defaultData = {
    project_id: projectId,
    podcast_id: null,
    publisher_id: publisherId,
    media_type: MEDIA_TYPE.podcast,
    referrer: document.referrer,
    location: document.location.href,
    device_type: getDeviceType(),
  }
  if (not(withoutUuids)) {
    defaultData.listen_session_id = uuidV4()
    defaultData.user_id = getUserId()
  }
  if (projectCampaignId) {
    defaultData.project_campaign_id = projectCampaignId
  }

  return {
    trackEvent(params = {}) {
      if (!eventBackendUrl) return
      const data = merge(defaultData, params)

      return http.post(eventBackendUrl, {
        body: data,
      }).catch(error => {
        errorLog(new Error(`EventTracker Error: ${error}`), true)
      })
    },
    setMediaType(type) {
      defaultData.media_type = type
    },
    getMediaType() {
      return defaultData.media_type
    },
  }
}

export default eventTracker
