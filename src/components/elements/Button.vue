<template lang="pug">
  button(:class="buttonClass")
    slot
</template>

<script scoped>
export default {
  name: 'button',
  computed: {
    buttonClass() {
      return ['Button', {
        'blank': this.blank,
        'large': this.large,
        'circle': this.circle,
        'outline': this.outline,
        'outline--light': this.lightOutline
      }];
    }
  },
  props: {
    large: Boolean,
    blank: Boolean,
    circle: Boolean,
    outline: Boolean,
    lightOutline: String
  }
};
</script>

<style lang="scss" scoped>
.Button {
  appearance: none;
  background-color: var(--color-brand);
  border: 0;
  border-radius: var(--border-radius-sm);
  color: white;
  cursor: pointer;
  font-family: inherit;
  font-weight: inherit;
  line-height: inherit;
  padding: 8px 16px;
  // transition: background-color 0.1s, color 0.1s, opacity 0.2s ease-out;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;

  &:hover {
    box-shadow: inset 0 0 0 999px color(var(--color-brand) blackness(20%));
  }

  &:focus {
    outline: 0;
    box-shadow: 0 0 0 2px var(--color-bg);
  }

  &:active {
    background-color: var(--color-bg);
    box-shadow: inset 0 0 8px var(--color-brand);
    color: var(--color-brand) !important;
  }

  &:disabled {
    opacity: 0.25;
  }

  //
  // outline variation
  //

  &.outline {
    background-color: transparent;
    box-shadow: inset 0 0 0 1px;
    color: var(--color-brand) !important;

    &:hover {
      background-color: var(--color-brand);
      color: var(--color-bg) !important;
    }

    &:focus {
      box-shadow: inset 0 0 0 2px, 0 0 0 1px;
    }

    &:active {
      background-color: var(--color-brand);
      box-shadow: inset 0 0 0 1px var(--color-brand), inset 0 0 8px color(var(--color-brand) blackness(20%));
      color: var(--color-bg);
    }
  }

  &.outline--light {
    background-color: transparent;
    box-shadow: inset 0 0 0 1px;
    color: currentColor;

    &:hover {
      background-color: var(--color-bg);
      color: var(--color-brand);
    }

    &:focus {
      box-shadow: inset 0 0 0 1px, 0 0 0 1px;
    }

    &:active {
      background-color: currentColor;
      box-shadow: inset 0 0 0 1px currentColor, inset 0 0 8px color(var(--color-brand) blackness(20%));
      color: var(--color-bg);
    }
  }







  &.large {
    border-color: var(--color-bg);
    color: var(--color-bg);
    padding: 0.4em 0.75em 0.5em 0.8em;
    transform: translateX(0);
    transition: all 250ms ease;

    &:hover {
      transform: translateX(5px);
      transition: all 250ms ease;
    }
  }

  &.blank {
    color: inherit;
    border: initial;
    height: auto;
  }



  &.wide {
    width: 100%;
  }

  &.hidden {
    opacity: 0;
    cursor: default;
    pointer-events: none;
  }


}





// .theme-dark .Button.outline--light {
//   border-color: currentColor;
//   color: var(--color-text);
// }

// .Paper-path-button .Button {
//   transform: translateX(0);
//   transition: all 250ms ease-out;
//   z-index: 1;
// }
//
// .Paper-path-button:hover .Button {
//   transform: translateX(5px);
//   transition: all 250ms ease-out;
// }
</style>
