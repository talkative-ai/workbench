<template>
  <div id="RouteProjectCreate">
    <div class="main-container">
      <h1>Imagine a place, and...</h1>
      <h2>Name your world:</h2>
      <input />
      <div class="input-hint">
        You can change this later.
        <i>(Other people will see this name when you publish!)</i>
      </div>
    </div>
    <div class="bottom-container">
      <router-link to="/zone/create">
        <button>
          Begin
        </button>
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
  color: $light-grey;
  font-size: 2.5rem;
  margin: 0pt;
}

h2 {
  font-size: 2.6rem;
}

button {
  color: $purple;
  background-color: transparent;
  border: 1pt solid $purple;
  padding: 1rem 2rem;
  font-size: 2rem;
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  transition: background-color 0.1s, color 0.1s;

  &::after {
    content: '\25b6';
    font-size: 1.5rem;
    padding-left: 0.5rem;
  }

  &:hover {
    background-color: $purple;
    color: white;
  }
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
