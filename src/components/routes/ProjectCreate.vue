<template>
  <div id="RouteProjectCreate">
    <div class="main-container">
      <h1>"All children, except one, grow up..."</h1>
      <h2>Imagine a place.</h2>
      <h3>Now give your project a name:</h3>
      <input />
      <div class="input-hint">
        You can change this later.
        <i>(Other people will see this name when you publish!)</i>
      </div>
    </div>
    <div class="bottom-container">
      <router-link to="/zone/create">
      Begin &gt;
      </router-link>
    </div>
  </div>
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
  margin: 15%;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 100;
}

h1 {
  color: $purple;
  font-size: 2.5rem;
  margin-left: -1rem;
}

h2, h3 {
  margin: 0;
  font-size: 1.7rem;
}

input {
  width: 50%;
  margin-top: 1rem;
  font-size: 2.5rem;
  padding: 0.5rem 0;
  font-weight: 100;
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
  color: $purple;
  text-align: right;
  padding-right: 10%;
  font-size: 2rem;

}
</style>
