<template lang="pug">
  #RouteDialogHome
    sidebar
    paper
      input.quoted(v-for="(entry, index) of node.EntryInput" :key="index" v-model="node.EntryInput[index]")
      button(@click="addEntry") Add potential entry input
      hr
      .node-values(v-for="(sound, index) of node.AlwaysExec.PlaySounds" :key="`sound-${node.ID}-${index}`")
        .inner-values
          input(placeholder="Enter speech text here!" v-model="sound.Val")
          button(@click="deleteAction('PlaySounds', index)") Delete
      button(@click="addAction()")
        Add Action
      hr
      div(
        @click="$router.push({ name: 'DialogHome', params: { id: $route.params.id, dialog_id: nodeID }})"
        v-for="nodeID of node.ChildNodes"
        :key="nodeID"
      )
        div "{{ dialogs[nodeID].EntryInput[0] }}"
      button(
        v-if="!this.isNew"
        @click="$router.push({ name: 'DialogCreate', params: { id: $route.params.id, dialog_id: $route.params.dialog_id }})"
      )
        | Add Response
      button(@click="save()") Save Changes
</template>

<script>
import Sidebar from '../Sidebar'
import Paper from '../Paper'

export default {
  name: 'DialogHome',
  components: {
    Sidebar,
    Paper
  },
  computed: {
    actor () {
      return this.$store.state.selectedEntity ? this.$store.state.selectedEntity.data : {}
    },
    isNew () {
      return this.$route.params.isNew
    },
    node () {
      if (this.isNew) return this.$store.state.newDialog
      return this.$store.state.dialogsMapped[this.$route.params.dialog_id]
    },
    dialogs () {
      return this.$store.state.dialogsMapped
    },
    actionSpeech: {
      get () {
        return this.node.AlwaysExec.PlaySounds
      },
      set (value) {
        for (let v of value) {
          if (typeof v === 'string') return false
        }
        this.node.AlwaysExec.PlaySounds = value
      }
    },
    actionTypes: {
      get () {
        return ['Speech', 'Set Zone']
      },
      set () {
        return
      }
    }
  },
  methods: {
    addActionSpeech (idx) {
      let newDialog = {
        SoundType: 0,
        Val: ''
      }
      this.node.AlwaysExec.PlaySounds.splice(idx, 0, newDialog)
    },
    addActionSetZone () {
      this.node.AlwaysExec.SetZone = 1
    },
    addEntry () {
      this.node.EntryInput.push('')
    },
    save () {
      if (!this.isNew) {
        this.$store.dispatch('updateDialog', this.node)
      } else {
        this.$store.dispatch('createNewDialog', this.node)
      }
    },
    deleteAction (type, index) {
      this.node.AlwaysExec[type].splice(index, 1)
    },
    onAddAction (evt) {
      let action = this.actionTypes[evt.oldIndex].replace(' ', '')
      this[`addAction${action}`](evt.newIndex)
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
  .Canvas {
    padding: 3rem;
  }

  .created-actions {
    flex: 1;
  }

  .available-actions {
    flex: 0;
    display: flex;
    justify-content: center;
  }

  .inner-values {
    font-size: 1rem;
    display: flex;
    align-items: center;
  }

  input {
    border: none;
    width: 100%;
  }

  .flex-columns {
    display: flex;
    flex-direction: columns;
  }

  .quoted {
    &:before {
      content: '"';
    }
  }
}
</style>
