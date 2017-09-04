<template>
  <div id="RouteActorCreate">
    <Sidebar />
    <PaperWorkspace>
      <div class="text">
        <h1>You don't have any actors yet.</h1>
        <h2>Create a new actor:</h2>
      </div>
      <div class="main">
        <div class="panel small">
          <div class="upload-image">
            <div class="background" />
            upload image
          </div>
          <div
          @click="actor.Title.length && create()"
          :class="`button wide ${!actor.Title.length ? 'disabled' : ''}`">
            Create actor
          </div>
        </div>
        <div class="panel">
          <label><span>Name <span class="note">(*required)</span>:</span>
            <input placeholder="What's their name?" v-model="actor.Title">
          </label>
          <label><span>Sex:</span>
            <input placeholder="Female, male, transgender, or...?">
          </label>
          <label><span>Age:</span>
            <input placeholder="How old are they?">
          </label>
          <label><span>Relationships:</span>
            <input placeholder="Parent? Spouse? Child?">
          </label>
          <label><span>Background Story:</span>
            <input placeholder="What is their story? Why are they who they are today?">
          </label>
          <label><span>Character:</span>
            <input placeholder="How do they behave?">
          </label>
        </div>
      </div>
    </PaperWorkspace>
  </div>
</template>

<script>
import Sidebar from '../Sidebar'
import PaperWorkspace from '../PaperWorkspace'

export default {
  name: 'ActorCreate',
  props: ['zoneid'],
  components: {
    Sidebar,
    PaperWorkspace
  },
  data () {
    return {
      actor: {
        Title: ''
      }
    }
  },
  methods: {
    create () {
      console.log(this.zoneid)
      if (this.zoneid) {
        this.actor.ZoneID = this.zoneid
      }
      this.$store.dispatch('createActor', this.actor)
      .then(actor => {
        if (this.zoneid) {
          this.$router.replace({ name: 'ZoneHome', params: { id: this.zoneid } })
        } else {
          this.$router.replace({ name: 'ActorHome', params: { id: actor.ID } })
        }
      })
    }
  }
}
</script>

<style lang="scss">
#RouteActorCreate {
  display: flex;
  justify-content: center;
  
  .upload-image {
    height: 65%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    background-color: $purple;
    margin-bottom: 2rem;
  }

}
</style>
