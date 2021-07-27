<script context="module">
  import { omit, noop } from '@speechkit/speechkit-audio-player-core/utils'
  import { skLogo as iconSkLogo } from '@speechkit/speechkit-audio-player-core/shared/customisations/controls/icons/types/skLogo'

  import Icon from './icon.svelte'
  import Link from '../controls/link.svelte'
  import { spktURL } from '../../constants/player'
</script>

<script>
  export let t = noop

  $: otherProps = omit(['class'], $$props)
  $: elementClass = `sk-copyright-link ${$$props.class || ''}`.trim()
</script>

<style>
  :global(.sk-copyright-link) {
    flex-grow: 0;
    color: currentColor;
  }

  :global(.sk-copyright-link:hover) {
    color: var(--sk-text-color);
  }

  :global(.sk-copyright-link span) {
    line-height: 1.5em;
    margin-left: 25px;
    margin-right: 8px;
  }
</style>

<Link
  {...otherProps}
  href={spktURL}
  class={elementClass}
>
  <span>{t('speechkit')}</span>
  <Icon iconProps={iconSkLogo} />
</Link>
