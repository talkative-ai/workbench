<template lang="pug">
  button(:class="buttonClass")
    slot
</template>



<script scoped>
export default {
  name: 'button',
  computed: {
    buttonClass () {
      return ['Button', {
        'blank': this.blank,
        'large': this.large,
        'circle': this.circle,
        'outline': this.outline,
        'outline--light': this.lightOutline
      }]
    }
  },
  props: {
    large: Boolean,
    blank: Boolean,
    circle: Boolean,
    outline: Boolean,
    lightOutline: Boolean
  }
}
</script>



<style lang="scss" scoped>
.Button {
  align-items: center;
  background-color: var(--color-brand);
  border: 1pt solid var(--color-brand);
  border-radius: var(--border-radius-sm);
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

  &.large {
    border: 1px solid white;
    color: var(--color-bg);
    padding: 0.4em 0.75em 0.5em 0.8em;
  }

  &.blank {
    color: inherit;
    border: initial;
    height: auto;
  }

  &.outline {
    background-color: transparent;
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
    background-color: var(--color-border);
    border-color: var(--color-border);
    // color: var(--color-border);

    &:hover {
      background-color: inherit;
      background-color: var(--color-border);
      border-color: var(--color-border);
      color: var(--color-bg);
    }
  }
}



.Button.Headline {
  height: auto;
}

.theme-dark .Button.outline--light {
  border-color: currentColor;
  color: var(--color-text);
}

.Paper-path-button .Button {
  transform: translateX(0);
  transition: all 250ms ease-out;
  z-index: 1;
}

.Paper-path-button:hover .Button {
  transform: translateX(5px);
  transition: all 250ms ease-out;
}
</style>
