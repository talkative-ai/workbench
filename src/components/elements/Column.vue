<template lang="pug">
  div(:class="columnClass")
    slot
</template>



<script scoped>
export default {
  name: 'column',
  computed: {
    columnClass () {
      return ['Grid-cell', {
        'u-sizeMenu': this.menu,
        'u-sizeMain': this.main,
        'u-sizeLogo': this.logo,
        'u-beforeSizeMenu': this.beforeMenu,
        'Grid-cell--center': this.center
      }]
    }
  },
  props: {
    menu: Boolean,
    main: Boolean,
    logo: Boolean,
    beforeMenu: String,
    center: Boolean
  }
}
</script>



<style scoped>
.u-sizeMenu {
  flex-basis: auto;
  padding-right: 0;
  width: calc(100% * 4 / 24);
}

.u-sizeMain {
  flex-basis: auto;
  width: calc(100% * 18 / 24);
}

.u-sizeLogo {
  flex-basis: auto;
  width: calc(100% * 2 / 24);
}

.u-beforeSizeMenu {
  margin-left: calc(100% * 4 / 24);
}
</style>
