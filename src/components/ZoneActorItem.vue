<template>
  <div class="actor-item" :class="{
      blank: !zoneActors || !zoneActors[actor.ID]
    }">
    <h1 class="Headline">{{ actor.Title }}</h1>
    <div class="button-grid">
      <w-button class="add-button" v-if="!zoneActors || !zoneActors[actor.ID]"
        @click="addActor(actor.ID)">
        <fa-icon name="plus"></fa-icon>Add to zone</w-button>
      <w-button class="remove-button" outline="outline" v-if="zoneActors && zoneActors[actor.ID]"
        @click="removeActor(actor.ID)">
        <fa-icon name="times"></fa-icon>Remove from zone</w-button>
      <w-button @click="selectActor(actor.ID)">
        <fa-icon name="comments"></fa-icon>Conversations</w-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ZoneActorItem',
  props: ['actor', 'zoneActors', 'zoneID'],
  methods: {
    selectActor(ID) {
      this.$store.dispatch('actors/selectActor', ID)
      .then(() => {
        this.$router.push({ name: 'ActorDialog', params: { id: ID } });
      });
    },
    removeActor(ID) {
      this.$store.dispatch('zones/removeActorFromZone', { ActorID: ID, ZoneID: this.zoneID });
    },
    addActor(ID) {
      this.$store.dispatch('zones/addActorToZone', { ActorID: ID, ZoneID: this.zoneID });
    }
  }
};
</script>

<style lang="scss" scoped>
.add-button, .remove-button {
  width: 170px;
}
.actor-item {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-brand);
  padding: 5pt 5pt 0 5pt;
  box-shadow: 0 0 5pt rgba(0,0,0,0.4);
  transition: background-color 0.20s, box-shadow 0.20s;

  &.blank {
    box-shadow: none;
    border-color: grey;
    background-color: rgba(0,0,0,0.05);
    h1 {
      opacity: 0.5;
    }
  }
}
</style>
