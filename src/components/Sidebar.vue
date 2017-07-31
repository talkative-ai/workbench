<template>
  <div id="Sidebar">
    <div class="zones wrapper">
      <span class="selected">Zone 1</span>
      <span class="new" @click="$router.push('/zone/create/')">New Zone</span>
    </div>
    <div class="actor wrapper">
      <span>Actor 1</span>
      <span>Actor 2</span>
      <span>Actor 3</span>
      <span>Actor 4</span>
      <span>Actor 5</span>
      <span>Actor 6</span>
      <span class="new">New Actor</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar'
}
</script>

<style lang="scss" scoped>
#Sidebar, .wrapper {
  display: flex;
  flex-direction: column;
}

.wrapper {
  margin: 2rem;
  margin-right: 0;
  span {
    background-color: white;
    border: 1px solid #efefef;
    border-right-width: 1px;
    border-left-width: 1px;
    padding: 1rem;
    width: 10rem;
    height: 1.2rem;
    color: #828282;
    cursor: pointer;

    &:hover {
      background-color: #eee;
    }

    &:nth-child(1) {
      border-top-width: 2px;
    }
    &:last-child() {
      border-bottom-width: 2px;
    }

    &.selected {
      background-color: $purple;
      border-color: $purple;
      color: white;
      cursor: default;
    }
  }
  .new {
    border: 1px solid #efefef;
    background-color: white;
    color: $purple;
    font-weight: bold;
    display: flex;
    align-items: center;
    &:before {
      font-size: 2rem;
      font-weight: 100;
      content: '+';
      margin-right: 0.7rem;
      margin-bottom: 0.5rem;
    }
    &:hover {
      background-color: $purple;
      color: white;
      border-color: $purple;
    }
  }
}
</style>
