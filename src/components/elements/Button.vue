<template>
  <button @click="$emit('click', $event)" :disabled="this.disabled" :class="buttonClass">
    <slot></slot>
  </button>
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
    lightOutline: String,
    disabled: Boolean
  }
};
</script>

<style lang="scss" scoped>
  button {
    border-radius: 0.2rem;
    outline: none !important;
    border: 1px solid $purple;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: color 0.15s, background-color 0.15s, box-shadow 0.3s, border 0.3s;
    color: rgba(0,0,0,0.8);

    > svg {
      margin-right: 5px;
    }

    &:hover:enabled {
      background-color: $purple;
      color: white;
      box-shadow: 0.2rem 0.2rem 0.8rem rgba(0,0,0,0.5);
    }

    &:active:enabled {
      box-shadow: 0 0 0.5rem rgba(0,0,0,0.4);
      color: rgba(255,255,255,0.9);
      background-color: $purple;
    }

    &:disabled {
      border: 1px solid grey;
      color: grey;
    }
  }
</style>
