<template lang="pug">
  column(menu id="Sidebar")
    nav.Sidebar
      .Sidebar-item.Text--sm(
        v-for="zone in $store.state.selectedProject.Zones"
        :key="zone.ID"
        @click="selectZone(zone)"
        :class="selectedZoneID === zone.ID ? 'is-selected' : ''"
      )
        span
          small Zone
          | {{ zone.Title }}
      .Sidebar-item.Text--sm(
        :class="$router.currentRoute.name === 'ZoneCreate' ? 'is-selected' : ''"
        @click="$router.push({ name: 'ZoneCreate' })"
      )
        span
          icon(name="add" width="24" height="24")
          | New zone
</template>

<script>
import '../assets/icons2';
import Column from './elements/Column';

export default {
  name: 'sidebar',
  components: {
    Column
  },
  computed: {
    selectedZoneID() {
      if (!this.$store.state.selectedEntity.data) return false;

      return this.$store.state.selectedEntity.data.ID;
    }
  },
  methods: {
    selectZone(zone) {
      this.$store.dispatch('selectZone', zone.ID)
      .then(() => {
        this.$router.push({ name: 'ZoneHome', params: { id: zone.ID } });
      });
    }
  }
};
</script>



<style lang="scss" scoped>
.Sidebar {
  display: flex;
  flex-direction: column;
  margin: var(--grid-gutter);
  margin-right: 0;
  user-select: none;
}

.Sidebar-item {
  align-items: center;
  background-color: white;
  border: 1px solid var(--color-border);
  border-right: initial;
  border-bottom: initial;
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

  &:first-child {
    border-top-left-radius: var(--border-radius-sm);
  }

  &:last-child {
    border-bottom-left-radius: var(--border-radius-sm);
    border-bottom: 1px solid var(--color-border);
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

  + .Sidebar-item {
    margin-top: -1px;
  }
}

.theme-dark .Sidebar-item:not(.is-selected) {
  background-color: transparent;
  border-color: rgba(229, 229, 229,0.15);
  color: var(--color-text-mid);
}

.theme-dark .Sidebar-item:last-child {
  border-top-color: transparent !important;
}
</style>
