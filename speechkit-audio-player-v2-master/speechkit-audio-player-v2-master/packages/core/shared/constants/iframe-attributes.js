import { makeInlineScript } from '../../utils'

const oldEmbeddedHeight = 43
const embeddedHeight = 60
const playlistHeight = 414
const baseStyles = 'margin:0!important;border:none!important;min-width:280px;'
const standardWidth = `${baseStyles}width:100%;height:${embeddedHeight}px;`
const withForbesMargin = `margin:24px auto 0;border:none;min-width:280px;width:100%;height:${embeddedHeight}px;`
const fullWidth = 'margin:0!important;border:none!important;min-width:100%;width:10px;'

const makeOnload = (height = embeddedHeight) => makeInlineScript(`
  var body = this.contentDocument && this.contentDocument.querySelector('body');
  var height = body ? body.getBoundingClientRect().height : ${height};
  this.style.height = height+'px';
`)
const replaceHeightToOld = str => (
  str.replace(/(height:)(\d*)(px)/gm, (all, p1, p2, p3) => (`${p1}${oldEmbeddedHeight}${p3}`))
)

export const IFRAME_ATTRS = {
  style: standardWidth,
  mobileStyle: standardWidth,
  onload: makeOnload(),
}

export const IFRAME_ATTRS_OLDER = {
  style: replaceHeightToOld(standardWidth),
  mobileStyle: replaceHeightToOld(standardWidth),
  onload: makeOnload(oldEmbeddedHeight),
}

export const PLAYLIST_STYLE_IFRAME_ATTRS = {
  style: fullWidth,
  mobileStyle: fullWidth,
  onload: makeOnload(playlistHeight),
}

export const FORBES_ATTRS = {
  style: withForbesMargin,
  mobileStyle: withForbesMargin,
  onload: makeOnload(),
}

export const NETTAVISEN_ATTRS = {
  style: `${baseStyles}width:375px;height:150px;`,
  mobileStyle: `${baseStyles}width:100%;height:150px;`,
  minimalStyle: `${baseStyles}width:375px;height:45px;`,
}
