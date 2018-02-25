<template>
  <div :class="{
    'icon-button': true,
    flat: this.flat,
    shrinky: this.shrinky,
    normal: !this.shrinky
  }" @click="onClick($event)">
    <fa-icon v-if="name" :name="name"></fa-icon>
    <div class="label" v-if="label">{{ label }}</div>
  </div>
</template>

<script scoped>
import 'vue-awesome/icons/pencil';
import 'vue-awesome/icons/search';
import 'vue-awesome/icons/plus';
import 'vue-awesome/icons/times';
import 'vue-awesome/icons/link';
import 'vue-awesome/icons/trash';
import 'vue-awesome/icons/exclamation-triangle';
import 'vue-awesome/icons/chain-broken';
import 'vue-awesome/icons/comments';
import 'vue-awesome/icons/refresh';

export default {
  name: 'icon-button',
  props: ['name', 'label', 'flat', 'shrinky'],
  methods: {
    onClick($event) {
      if (this.$listeners.click) {
        $event.stopPropagation();
        this.$emit('click', $event);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.icon-button {
  background-color: var(--color-brand);
  color: white;
  border-radius: 20pt;
  min-width: 20pt;
  padding: 5pt;
  height: 20pt;
  justify-content: center;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.shrinky:hover {
  .label {
    max-width: 100px;
    padding: 5pt;
  }
}

.flat {
  background-color: transparent;
  color: $purple;
}

.shrinky > .label {
  max-width: 0;
  padding: 0;
}

.normal > .label {
  padding: 5pt;
}

.label {
  font-weight: bold;
  font-size: 1rem;
  overflow: hidden;
  transition: all 0.25s;
  text-align: left;
}
.danger {
  background-color: $danger !important;
}
</style>
