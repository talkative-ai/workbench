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
        'circle': this.circle,
        'outline': this.outline,
        'outline--light': this.lightOutline
      }]
    }
  },
  props: {
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

  &.blank {
    color: inherit;
    border: initial;
    height: auto;
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

  // .button & {
  //   border-color: white;
  //   color: white;
  //   &:hover {
  //     background-color: transparent;
  //   }
  // }
}

.Button.Headline {
  height: auto;
}

.theme-dark .Button.outline--light {
  border-color: currentColor;
  color: var(--color-text);
}
</style>
