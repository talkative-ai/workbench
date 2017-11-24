<template>
  <div class="icon-button" :class="classList">
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

export default {
  name: 'icon-button',
  props: ['name', 'label', 'flat'],
  data() {
    let classList = [];
    if (this.flat) {
      classList.push('flat');
    }
    return {
      classList: classList.join(' ')
    };
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

  .icon-button:hover {
    .label {
      max-width: 100px;
      padding: 5pt;
    }
  }

.flat {
  background-color: transparent;
  color: $purple;
}

.label {
  font-weight: bold;
  font-size: 1rem;
  max-width: 0;
  padding: 0;
  overflow: hidden;
  transition: all 0.25s;
  text-align: left;
}
.warn-button {
  background-color: $warn !important;
}
</style>
