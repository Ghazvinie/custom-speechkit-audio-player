<script context="module">
  import { onMount } from 'svelte'
  import { Provider } from 'svelte-redux-connect'
  import { noop, addListenerChangeDarkColorScheme } from '@speechkit/speechkit-audio-player-core/utils'

  import StyleReseter from '../styles/reset.svelte'
  import CommonStyles from '../styles/commons.svelte'
  import { setParams } from '../../actions/app'
  import { getApp } from '../../selectors'
</script>

<script>
  export let store
  export let AppBox
  export let mapApp
  export let useGlobalStyleReset = false
  export let useChangeColorScheme = false
  export let dispatch = noop

  let component = null

  onMount(() => {
    component = mapApp(AppBox)
    if (useChangeColorScheme) {
      addListenerChangeDarkColorScheme(isDark => {
        const { publisherDm } = getApp(store.getState())
        dispatch(setParams({ useDarkModeScheme: publisherDm && isDark }))
      })
    }
  })
</script>

{#if useGlobalStyleReset}
  <StyleReseter />
{/if}
<CommonStyles />

<Provider {store}>
  <svelte:component this={component} />
</Provider>
