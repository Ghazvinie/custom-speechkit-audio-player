/* eslint-env jest */
import { xmlDoc } from './mocks/vast-xml-doc'
import processVastAd from '../ads/parse-vast-ad'

describe('parse-vast-ad', () => {
  let docs
  beforeEach(() => {
    docs = new DOMParser().parseFromString(xmlDoc, 'text/xml')
  })

  it('should parse xml document', () => {
    expect(processVastAd(docs)).toMatchSnapshot()
  })
})
