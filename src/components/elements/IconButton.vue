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

.flat {
  background-color: transparent;
  color: $purple;
}

.label {
  font-weight: bold;
  padding: 5pt;
  font-size: 1rem;
}

</style>
