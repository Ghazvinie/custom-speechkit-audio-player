export const clearStyles = () => {
  const svelteStyles = Array.from(document.querySelectorAll('style[id*=svelte]'))
  svelteStyles.forEach(styleEl => {
    styleEl.parentNode.removeChild(styleEl)
  })
}
