import {
  MediaElementEvents, isSupportNativeHLS, DEFAULT_PLAYBACK_RATE,
} from '../shared/constants/media'
import { noop, isFunction } from '../utils'

export default class Native {
  static get elementEvents() {
    return MediaElementEvents
  }

  static get canPlayHls() {
    return isSupportNativeHLS
  }

  static get apiFns() {
    return ['play', 'pause', 'setCurrentTime', 'setSpeedRate']
  }

  constructor(props) {
    const { listener } = props
    this.audioElement = null
    this.source = null
    this.rate = DEFAULT_PLAYBACK_RATE
    this.playPromise = null
    this.handler = isFunction(listener) ? listener : noop
  }

  initElement() {
    if (!this.element) this.element = new Audio()
    this.volume = 1
    Native.elementEvents.forEach(events => {
      this.element.addEventListener(events, this.handler)
    })
  }

  play(source) {
    if (!this.element) {
      this.initElement()
    }

    if (this.src !== source) {
      this.currentTime = 0
      this.src = source
    }

    return this.selfPlay()
  }

  selfPlay() {
    this.playbackRate = this.rate
    if (this.src) {
      this.playPromise = this.element.play() || Promise.resolve(true)
      return this.playPromise
    }
  }

  pause() {
    if (!this.element) return

    if (this.playPromise) {
      this.playPromise.then(() => {
        this.playPromise = null
        this.element.pause()
      })
    } else {
      this.element.pause()
    }
  }

  selfPause() {
    return new Promise(res => {
      if (!this.element) {
        return res()
      }

      if (this.playPromise) {
        this.playPromise.then(() => {
          this.playPromise = null
          this.element.pause()
          res()
        })
      } else {
        this.element.pause()
        res()
      }
    })
  }

  setCurrentTime(time) {
    this.currentTime = time
  }

  setSpeedRate(rate = DEFAULT_PLAYBACK_RATE) {
    this.playbackRate = rate
  }

  destroy() {
    return new Promise(res => {
      if (!this.element) return res()
      this.selfPause().then(() => {
        Native.elementEvents.forEach(events => {
          this.element.removeEventListener(events, this.handler)
        })
        this.element = null
        res()
      })
    })
  }

  set element(element) {
    this.audioElement = element
  }

  get element() {
    return this.audioElement
  }

  set src(source) {
    this.source = source
    this.element.src = this.source
  }

  get src() {
    return this.source
  }

  set listener(listener) {
    this.handler = listener
  }

  set volume(value) {
    this.element.volume = value
  }

  get volume() {
    return this.element.volume
  }

  set playbackRate(value) {
    this.rate = value
    if (this.element) {
      this.element.playbackRate = value
    }
  }

  get playbackRate() {
    return this.element ? this.element.playbackRate : this.rate
  }

  set currentTime(value) {
    /* IE11-ONLY:START */
    const beforeIsPaused = this.paused || this.ended
    /* IE11-ONLY:END */
    this.element.currentTime = value
    /* IE11-ONLY:START */
    if (beforeIsPaused) this.pause()
    /* IE11-ONLY:END */
  }

  get currentTime() {
    return this.element.currentTime || 0
  }

  get duration() {
    const { duration } = this.element
    return Number.isNaN(duration) || !Number.isFinite(duration)
      ? 0
      : duration
  }

  get paused() {
    return this.element.paused
  }

  get ended() {
    return this.element.ended
  }

  get buffered() {
    return this.element.buffered
  }

  set title(title) {
    this.element.setAttribute('title', title)
  }
}
