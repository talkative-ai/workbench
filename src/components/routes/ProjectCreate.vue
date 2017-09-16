<template lang="pug">
  #RouteProjectCreate
    .main-container
      h1 Imagine a place, and...
      h2 Name your game:
      input
      .input-hint
        | You can change this later.
        i (Other people will see this name when you publish!)
    .bottom-container
      router-link.button(to='/zone/create')
        | Begin
</template>

<script>
export default {
  name: 'ProjectCreate'
}
</script>

<style lang="scss" scoped>
#RouteProjectCreate {
  display: flex;
  flex-direction: column;
}

.main-container {
  margin: 15% 0;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 100;
}

h1 {
  color: $light-grey;
  font-size: 2.5rem;
  margin: 0pt;
}

h2 {
  font-size: 2.6rem;
}

h2, h3 {
  color: $purple;
  margin: 0pt;
  margin: 0;
}

h3 {
  color: $light-grey;
}

.input-hint {
  color: $light-grey;
  i {
    display: block;
  }
}

.bottom-container {
  text-align: right;
  padding-right: 10%;
}
</style>
