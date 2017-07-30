<template>
  <div id="Sidebar">
    <div class="zones-wrapper">
      <span class="selected">Zone 1</span>
      <span class="new">New Zone</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar'
}
</script>

<style lang="scss" scoped>
#Sidebar, .zones-wrapper {
  display: flex;
  flex-direction: column;
}

.zones-wrapper {
  margin: 2rem;
  margin-right: 0;
  span {
    background-color: transparent;
    border: 1px solid #efefef;
    border-right-width: 1px;
    border-left-width: 1px;
    padding: 10pt;
    width: 10rem;
    height: 1.2rem;

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
    }
  }
}
</style>
