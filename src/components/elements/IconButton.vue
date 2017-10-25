<template lang="pug">
  .icon-button
    fa-icon(v-if="name" :name="name")
    .label(v-if="label") {{ label }}
</template>



<script scoped>
import 'vue-awesome/icons/pencil';
import 'vue-awesome/icons/search';
import 'vue-awesome/icons/plus';
export default {
  name: 'icon-button',
  props: ['name', 'label']
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

.label {
  font-weight: bold;
  padding: 5pt;
  font-size: 1rem;
}

</style>
