<script context="module">
  import { prop } from '@speechkit/speechkit-audio-player-core/utils'
</script>

<script>
  export let iconProps = {}
  export let color = 'currentColor'

  $: paths = iconProps.paths
  $: pathsProps = iconProps.pathsProps
  $: viewBox = iconProps.viewBox
  $: getGroupProp = name => prop(name, iconProps.groupProp)
</script>

<style>
  .sk-icon {
    pointer-events: none;
    user-select: none;
    transform: translateZ(0);
  }
</style>

<svg
  class="sk-icon"
  xmlns="http://www.w3.org/2000/svg"
  width={iconProps.width}
  height={iconProps.height}
  {viewBox}
>
<g
  stroke={getGroupProp('stroke')}
  stroke-width={getGroupProp('stroke-width')}
  fill-rule={getGroupProp('fill-rule')}
  fill={color || getGroupProp('fill')}
>
  {#each paths as path, idx}
    <path d={path} fill-rule="nonzero" style={pathsProps[idx] || ''} />
  {/each}
</g>
</svg>
