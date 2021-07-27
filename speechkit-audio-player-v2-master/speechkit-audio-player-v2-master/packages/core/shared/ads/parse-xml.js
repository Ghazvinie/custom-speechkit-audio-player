import {
  curry, eq, compose, map,
} from '../../utils'

// filter out text nodes
const filterOutTextNodes = nodes => (
  nodes.filter(({ nodeType }) => nodeType !== Node.TEXT_NODE)
)

export const getElByName = curry((node, name) => (
  node.getElementsByTagName(name)
))

export const getAttr = curry((node, name) => (
  node.getAttribute(name)
))

const getTextContent = map(node => node.textContent)

// Return array of all nodes in aXMLNodes that have sAttribute equal to sReqValue
export const getNodesWithAttrValue = (aXMLNodes, sAttribute, sReqValue) => {
  const eqSReqValue = eq(sReqValue)
  const getSAttribute = _ => getAttr(_, sAttribute)
  return filterOutTextNodes(Array.from(aXMLNodes))
    .filter(compose(eqSReqValue, getSAttribute)) // filter for node value
}

// Return array of textContent of all nodes in aXMLNodes that have sAttribute equal to sReqValue
// Currently used for getting tracking urls
export const getContentOfNodesWithAttrValue = (aXMLNodes, sAttribute, sReqValue) => (
  getTextContent(getNodesWithAttrValue(aXMLNodes, sAttribute, sReqValue))
)

// Take array of XML Nodes & return array of the text content of each node
// (used for getting error/impression urls)
const getNodeValues = aXMLNodes => (
  getTextContent(filterOutTextNodes(Array.from(aXMLNodes))) // filter out text nodes
) // then return textContent

// pass in xml node and event type string, return array of events
export const getVASTEventURLs = (xNode, sEventType) => (
  getNodeValues(getElByName(xNode, sEventType))
)

// store error/impression events from VAST XML
export const getCreative = xAd => {
  // Look for all creatives:
  // take the first linear creative (can expand for adservers returning >1)
  const [xCreative] = Array.from(getElByName(xAd, 'Creative'))
    // now filter for those creatives that have a linear node
    .filter(node => getElByName(node, 'Linear').length)

  return xCreative
}
