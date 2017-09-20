<template>
  <grid gutter id="RouteActorCreate">
    <sidebar />
    <paper>
      <paper-text>
        <h1 class="Headline">You don't have any actors yet.</h1>
        <h2 class="Headline">Create a new actor:</h2>
      </paper-text>
      <paper-text>
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
      </paper-text>
    </paper>
  </grid>
</template>

<script>
import Grid from '../elements/Grid'
import Sidebar from '../Sidebar'
import Paper from '../Paper'
import PaperText from '../elements/PaperText'

export default {
  name: 'ActorCreate',
  props: ['zoneid'],
  components: {
    Sidebar,
    Grid,
    PaperText,
    Paper
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
.upload-image {
  height: 65%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: $purple;
  margin-bottom: 2rem;
}
</style>
