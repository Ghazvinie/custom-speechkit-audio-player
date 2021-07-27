(() => {
  let speechkitModule
  const domReady = callback => {
    // eslint-disable-next-line no-unused-expressions
    document.readyState === 'interactive' || document.readyState === 'complete'
      ? callback()
      : document.addEventListener('DOMContentLoaded', callback)
  }

  /**
   * Attempt to find the container Element for the SpeechKit audio player.
   *
   * The desired location is directly above the main article text.
   *
   * @returns {Element|null} HTML Element, or null for no matches
   */
  const getContainerElem = () => {
    // Check for the data-container script attribute
    speechkitModule = document.getElementById('speechkit-module')
    const containerAttr = speechkitModule.getAttribute('data-container')
    if (containerAttr) {
      return document.querySelector(containerAttr)
    }

    // Check for .speechkit-container
    const speechkitElems = document.getElementsByClassName('speechkit-container')
    if (speechkitElems.length) {
      return speechkitElems[0]
    }

    // Ensure this is a single Ghost post/page
    // We do not want to insert audio players on e.g. the homepage
    const isAPost = document.body.classList.contains('post-template')
    const isAPage = document.body.classList.contains('page-template')
    if (!isAPost && !isAPage) {
      // TODO consider returning an Error code which doesn't console.log
      throw Error('The player is only available on single Posts and Pages.')
    }

    // Check for .post-full-content
    const fullContentElems = document.getElementsByClassName('post-full-content')
    if (fullContentElems.length) {
      return fullContentElems[0]
    }

    // Check for <article>
    const articleTags = document.getElementsByTagName('Article')
    if (articleTags.length) {
      // Check for a <header> in the <article>
      const headerTags = articleTags[0].getElementsByTagName('Header')
      if (headerTags.length) {
        // Use the <header>
        return headerTags[0]
      }
      // Use the <article>
      return articleTags[0]
    }

    // Check for .content
    const contentElems = document.getElementsByClassName('content')
    if (contentElems.length) {
      return contentElems[0]
    }

    // Unable to find an Element
    return null
  }

  domReady(() => {
    try {
      const containerElem = getContainerElem()

      if (!containerElem) {
        throw Error('Unable to display the audio player. See https://ghost.org/integrations/speechkit/#advanced for further information.')
      }

      // The project ID is passed in the script, using data-project-id
      const projectId = speechkitModule.getAttribute('data-project-id')

      if (!projectId) {
        throw Error('The <script> tag is missing the data-project-id attribute.')
      }

      const node = document.createElement('div')
      node.setAttribute('id', 'speechkit-player')
      node.style.width = '100%'

      // TODO make marginBottom configurable (as a data attribute)
      node.style.marginBottom = '1em'

      containerElem.insertBefore(node, containerElem.firstChild)

      // TODO make player background colour configurable (as a data attribute)
      import(process.env.spktCDN).then(({ default: SpeechKit }) => {
        const SpeechKitSdk = SpeechKit.sdk
        SpeechKitSdk.player({
          projectId,
          skBackend: process.env.skBackend,
          articleUrl: window.location.href,
        })
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(`SpeechKit ${String.fromCodePoint(0x1F50A)} ${err.message}`)
    }
  })
})()
