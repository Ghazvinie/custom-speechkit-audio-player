/* eslint-env jest */
import { parseHostname } from '../dom'

describe('@speechkit/speechkit-audio-player-core/utils/dom.js', () => {
  describe('parseHostname()', () => {
    it('should be return a hostname from url', () => {
      expect(parseHostname('http://www.blog.websitename.me.uk/index.php')).toEqual('www.blog.websitename.me.uk')
      expect(parseHostname('http://www.websitename.com/watch?v=ClkQA2Lb_iE')).toEqual('www.websitename.com')
      expect(parseHostname('https://www.websitename.com/watch?v=ClkQA2Lb_iE')).toEqual('www.websitename.com')
      expect(parseHostname('www.websitename.com/watch?v=ClkQA2Lb_iE')).toEqual('www.websitename.com')
      expect(parseHostname('ftps://ftp.websitename.com/dir/file.txt')).toEqual('ftp.websitename.com')
      expect(parseHostname('websitename.com:1234/dir/file.txt')).toEqual('websitename.com')
      expect(parseHostname('ftps://websitename.com:1234/dir/file.txt')).toEqual('websitename.com')
      expect(parseHostname('example.com?param=value')).toEqual('example.com')
      expect(parseHostname('https://websitename.github.io/jest/')).toEqual('websitename.github.io')
      expect(parseHostname('http://localhost:4200/watch?v=ClkQA2Lb_iE')).toEqual('localhost')
      expect(parseHostname('https://test.te/werw')).toEqual('test.te')
      expect(parseHostname('https://username:password@test.te/werw')).toEqual('test.te')
      expect(parseHostname('https://test.te/werw#2341')).toEqual('test.te')
      expect(parseHostname()).toEqual('')
      expect(parseHostname(null)).toEqual('')
      expect(parseHostname(undefined)).toEqual('')
    })
  })
})
