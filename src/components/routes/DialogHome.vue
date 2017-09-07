<template>
  <div id="RouteDialogHome">
    <Sidebar />
    <PaperWorkspace>
      <input class="quoted" v-model="node.EntryInput[0]" />
      <button>Add potential entry input</button>
      <hr />
      <div
      class="node-values"
      v-for="(sound, index) of node.AlwaysExec.PlaySounds" :key="`sound-${node.ID}-${index}`">
        <div class="inner-values">
          <input placeholder="Enter speech text here!" v-model="sound.Val" />
          <button @click="deleteAction('PlaySounds', index)">Delete</button>
        </div>
      </div>
      <button @click="addAction()">
        Add Action
      </button>
      <hr />
      <div
      @click="$router.push({ name: 'DialogHome', params: { id: $route.params.id, dialog_id: nodeID }})"
      v-for="nodeID of node.ChildNodes"
      :key="nodeID">
        <div>
          "{{ dialogs[nodeID].EntryInput[0] }}"
        </div>
      </div>
      <button>
        Add Response
      </button>
      <button @click="save()">
        Save Changes
      </button>
    </PaperWorkspace>
  </div>
</template>

<script>
import Sidebar from '../Sidebar'
import PaperWorkspace from '../PaperWorkspace'

export default {
  name: 'DialogHome',
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
    addAction () {
      let newDialog = {
        SoundType: 0,
        Val: ''
      }
      this.node.AlwaysExec.PlaySounds.push(newDialog)
    },
    save () {
      this.$store.dispatch('updateDialog', this.node)
    },
    deleteAction (type, index) {
      this.node.AlwaysExec[type].splice(index, 1)
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

  .quoted {
    &:before {
      content: '"';
    }
  }
}
</style>
