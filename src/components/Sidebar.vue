<template>
  <column menu id="Sidebar">
    <div class="zones wrapper">
      <span
        v-for="zone in $store.state.selectedProject.Zones"
        :key="zone.ID"
        @click="selectZone(zone)"
        :class="selectedZoneID === zone.ID ? 'selected' : ''">{{ zone.Title }}</span>
      <span class="new"
      :class="$router.currentRoute.name === 'ZoneCreate' ? 'selected' : ''"
      @click="$router.push({ name: 'ZoneCreate' })">New Zone</span>
      <span class="nav" @click="$router.push({ name: 'ActorHome' })"><span class="icon sized img-actor" />Actors</span>
    </div>
  </column>
</template>






<script>
import Column from './elements/Column'

export default {
  name: 'Sidebar',
  components: {
    Column
  },
  computed: {
    selectedZoneID () {
      if (!this.$store.state.selectedEntity.data) return false

      return this.$store.state.selectedEntity.data.ID
    }
  },
  methods: {
    selectZone (zone) {
      this.$router.push({ name: 'ZoneHome', params: { id: zone.ID } })
    }
  }
}
</script>






<style lang="scss" scoped>

.wrapper {
  display: flex;
  flex-direction: column;
  user-select: none;
}

.wrapper {
  margin: var(--grid-gutter);
  margin-right: 0;

  > span {
    background-color: white;
    border: 1px solid #efefef;
    border-right-width: 1px;
    border-left-width: 1px;
    padding: 1rem;
    height: 3.5rem;
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
  .new,
  .nav {
    border: 1px solid #efefef;
    background-color: white;
    color: $purple;
    font-weight: bold;
    display: flex;
    align-items: center;
    &:hover {
      background-color: $purple;
      color: white;
      border-color: $purple;
    }
  }
  .new::before {
    font-size: 2rem;
    font-weight: 100;
    content: '+';
    margin-right: 0.7rem;
    margin-bottom: 0.5rem;
  }
}
</style>
