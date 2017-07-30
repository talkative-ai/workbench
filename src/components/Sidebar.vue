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
    border: 2px solid #7F29FC;
    border-right-width: 4px;
    border-left-width: 4px;
    padding: 10pt;
    width: 10rem;
    height: 1.2rem;

    &:nth-child(1) {
      border-top-width: 4px;
    }
    &:last-child() {
      border-bottom-width: 4px;
    }

    &.selected {
      background-color: $purple;
    }
  }
  .new {
    border: 4px solid white;
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
