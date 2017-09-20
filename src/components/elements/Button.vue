<template>
  <button
    :class="['Button', {
      'circle': circle,
      'outline': outline,
      'outline--light': lightOutline
    }]">
    <slot />
  </button>
</template>



<script scoped>
export default {
  name: 'button',
  props: {
    circle: Boolean,
    outline: Boolean,
    lightOutline: Boolean
  }
}
</script>



<style lang="scss" scoped>
@import "~/../static/styles/assets/vars.css";

.Button {
  align-items: center;
  background-color: var(--color-brand);
  border: 1pt solid var(--color-brand);
  color: var(--color-bg);
  cursor: pointer;
  display: inline-flex;
  height: 36px;
  opacity: 1;
  padding: 0 1rem;
  transition: background-color 0.1s, color 0.1s, opacity 0.2s ease-out;

  &:hover {
    background-color: var(--color-brand);
    color: white;
  }

  &.outline {
    background-color: transparent;
    color: var(--color-brand);
  }

  &.outline--light {
    background-color: transparent;
    border-color: var(--color-text-lite);
    color: var(--color-text-lite);
  }

  &.wide {
    width: 100%;
  }

  &.hidden {
    opacity: 0;
    cursor: default;
    pointer-events: none;
  }

  &.disabled {
    cursor: default;
    border-color: lightgrey;
    color: lightgrey;

    &:hover {
      background-color: inherit;
      color: lightgrey;
    }
  }

  .button & {
    border-color: white;
    color: white;
    &:hover {
      background-color: transparent;
    }
  }
}



</style>
