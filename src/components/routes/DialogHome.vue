<template>
  <div id="RouteDialogHome">
    <Sidebar />
    <PaperWorkspace>
      <h1>"{{ node.EntryInput[0] }}"</h1>
      <div
      class="node-values"
      v-for="(sound, index) of node.AlwaysExec.PlaySounds" :key="`sound-${node.ID}-${index}`">
        <div class="inner-values">
          <input placeholder="Enter speech text here!" :value="sound.Val" />
        </div>
      </div>
      <button @click="addDialog()">
        Add Dialog
      </button>
      <hr />
      <div v-for="nodeID of node.ChildNodes" :key="nodeID">
        <div>
          "{{ dialogs[nodeID].EntryInput[0] }}"
        </div>
      </div>
      <button>
        Add Response
      </button>
    </PaperWorkspace>
  </div>
</template>

<script>
import Sidebar from '../Sidebar'
import PaperWorkspace from '../PaperWorkspace'

export default {
  name: 'DialogHome',
  data () {
    return {
      newActions: []
    }
  },
  components: {
    Sidebar,
    PaperWorkspace
  },
  computed: {
    node () {
      return this.$store.state.dialogsMapped[this.$route.params.dialog_id]
    },
    dialogs () {
      return this.$store.state.dialogsMapped
    }
  },
  methods: {
    addDialog () {
      let newDialog = {
        SoundType: 0,
        Values: ''
      }
      this.node.AlwaysExec.PlaySounds.push(newDialog)
      this.newActions.push(newDialog)
    }
  }
}
</script>

<style lang="scss" scoped>
#RouteDialogHome {
  display: flex;
  h1 {
    text-align: right;
  }
  .PaperWorkspace {
    padding: 3rem;
  }

  .inner-values {
    font-size: 1rem;
  }

  input {
    border: none;
    width: 100%;
  }
}
</style>
