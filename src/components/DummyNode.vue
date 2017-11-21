<template>
  <div class="DialogNode">
    <div class="wrap" style="height: 100px;">
      <div class="vspacer" v-if="parentNode"></div>
      <div class="ball" v-if="parentNode"></div>
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
  props: ['parentNode']
};
</script>
