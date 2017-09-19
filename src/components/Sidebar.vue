<template>
  <column menu id="Sidebar">
    <nav class="Nav">
      <div
        class="Nav-item smalltext"
        v-for="zone in $store.state.selectedProject.Zones"
        :key="zone.ID"
        @click="selectZone(zone)"
        :class="selectedZoneID === zone.ID ? 'is-selected' : ''">
        <span>
          <small>Zone</small>
          {{ zone.Title }}
        </span>
      </div>
      <div
        class="Nav-item smalltext"
        :class="$router.currentRoute.name === 'ZoneCreate' ? 'is-selected' : ''"
        @click="$router.push({ name: 'ZoneCreate' })">
        <span>
          <icon class="" name="add" width="24" height="24"></icon>
          New zone
        </span>
      </div>
      <div
        class="Nav-item smalltext"
        @click="$router.push({ name: 'ActorHome' })">
        <span>
          <icon class="" name="actor" width="24" height="24"></icon>
          Actors
        </span>
      </div>
    </nav>
  </column>
</template>



<script>
import '../assets/icons2'
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
// @import "~/../static/styles/assets/vars.css";

.Nav {
  display: flex;
  flex-direction: column;
  margin: var(--grid-gutter);
  margin-right: 0;
  user-select: none;
}

.Nav-item {
  align-items: center;
  background-color: white;
  border: 1px solid var(--color-border);
  color: var(--color-brand);
  cursor: pointer;
  display: flex;
  height: 4rem;
  padding: 0 1rem;
  position: relative;

  label,
  small {
    display: block;
  }

  span {
    transform: translateX(0);
    transition: all 250ms ease-out;
  }

  &:hover,
  &:focus,
  &:active {
    // background-color: var(--color-grey);
    // background-color: rgba(110, 0, 221, 0.1);
    // border-color: var(--color-brand);
    span {
      transform: translateX(5px);
      transition: all 250ms ease-out;
    }
  }

  &.is-selected {
    background-color: var(--color-brand);
    border-color: var(--color-brand);
    color: white;
    cursor: default;

    span {
      transform: translateX(0);
    }
  }

  + .Nav-item {
    margin-top: -1px;
  }
}
</style>
