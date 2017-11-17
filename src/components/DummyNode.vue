<template lang="pug">
  .DialogNode
    .wrap(style="height: 100px")
      .vspacer(v-if="isChildIteration")
      .ball(v-if="isChildIteration")
      .cover-wrap
        .cover.opaque.no-border
          h1
            slot
</template>

<script>
export default {
  name: 'DummyNode',
  props: ['isChildIteration']
};
</script>
