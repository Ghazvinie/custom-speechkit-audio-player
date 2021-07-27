import HlsLib from 'hls.js/dist/hls.light'
import Native from './native'

const { Events: HlsEvents } = HlsLib

export default class Hls extends Native {
  static get canPlayHls() {
    return HlsLib.isSupported()
  }

  constructor(props) {
    super(props)
    this.hls = null
  }

  initElement(source) {
    super.initElement()

    if (source.indexOf('.m3u8') === -1) {
      this.src = source
      return this.selfPlay()
    }

    this.hls = new HlsLib({
      debug: false,
      enableWorker: false,
      liveDurationInfinity: false,
    })

    return new Promise(res => {
      this.hls.attachMedia(this.element)
      this.hls.once(HlsEvents.MEDIA_ATTACHED, () => {
        this.element = this.hls.media
        this.src = source
        this.hls.on(HlsEvents.MANIFEST_PARSED, () => res(this.selfPlay()), this)
      })
    })
  }

  play(source) {
    if (!this.element) {
      // NOTE: first playback beginning after MANIFEST_PARSED event
      return this.initElement(source)
    }

    if (this.src !== source) {
      return this.destroy().then(() => {
        this.initElement(source)
      })
    }

    return this.selfPlay()
  }

  destroy() {
    return new Promise(res => {
      super.destroy().then(() => {
        if (this.hls) {
          this.hls.off(HlsEvents.MANIFEST_PARSED, this.selfPlay, this)
          this.hls.stopLoad()
          this.hls.destroy()
          this.hls = null
        }
        res()
      })
    })
  }

  set src(source) {
    this.source = source
    if (this.hls) {
      this.hls.loadSource(this.source)
    } else {
      this.element.src = this.source
    }
  }

  // NOTE: This limitation is due to how JS treats property accessors behind the scenes
  get src() {
    return super.src
  }
}
