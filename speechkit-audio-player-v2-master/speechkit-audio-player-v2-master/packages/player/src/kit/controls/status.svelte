<script>
  export let message = ''
  export let style = ''
</script>

<span class=sk-message {style}>{message}</span>

<style>
  .sk-message {
    font-size: var(--sk-font-size-msg);
    color: var(--sk-text-color);
  }
</style>
