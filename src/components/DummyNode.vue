<template>
  <div class="DialogNode">
    <div class="wrap" style="height: 100px;">
      <div class="vspacer" v-if="isChildIteration"></div>
      <div class="ball" v-if="isChildIteration"></div>
      <div class="cover-wrap">
        <div class="cover opaque no-border">
          <h1>
            <slot></slot>
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DummyNode',
  props: ['isChildIteration']
};
</script>
