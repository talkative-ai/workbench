<template lang="pug">
  #RouteDialogHome
    sidebar
    paper
      input.quoted(v-for="(entry, index) of node.EntryInput" :key="index" v-model="node.EntryInput[index]")
      w-button(@click.native="addEntry") Add potential entry input
      hr
      .node-values(v-for="(sound, index) of node.AlwaysExec.PlaySounds" :key="`sound-${node.ID}-${index}`")
        .inner-values
          input(placeholder="Enter speech text here!" v-model="sound.Val")
          w-button(@click.native="deleteAction('PlaySounds', index)") Delete
      w-button(@click.native="addActionSpeech()")
        | Add Action
      hr
      div(
        @click="$router.push({ name: 'DialogHome', params: { id: $route.params.id, dialog_id: nodeID }})"
        v-for="nodeID of node.ChildNodes"
        :key="nodeID"
      )
        div "{{ dialogs[nodeID].EntryInput[0] }}"
      template(v-if="!this.isNew")
        w-button(
          @click.native="$router.push({ name: 'DialogCreate', params: { id: $route.params.id, dialog_id: $route.params.dialog_id, is_root: false }})"
        )
          | Add Response
        w-button(
          @click.native="$router.push({ name: 'ActorDialog', params: { id: $route.params.id, dialog_id: $route.params.dialog_id, linking_child: true }})"
        )
          | Connect Existing Dialog
      w-button(@click.native="save()") Save Changes
</template>

<script>
import Sidebar from '../Sidebar';
import Paper from '../Paper';
import WButton from '../elements/Button';

export default {
  name: 'DialogHome',
  components: {
    Sidebar,
    Paper,
    WButton
  },
  computed: {
    actor() {
      return this.$store.state.selectedEntity ? this.$store.state.selectedEntity.data : {};
    },
    isNew() {
      return this.$route.params.isNew;
    },
    node() {
      if (this.isNew) return this.$store.state.newDialog;
      return this.$store.state.dialogsMapped[this.$route.params.dialog_id];
    },
    dialogs() {
      return this.$store.state.dialogsMapped;
    },
    actionSpeech: {
      get() {
        return this.node.AlwaysExec.PlaySounds;
      },
      set(value) {
        for (let v of value) {
          if (typeof v === 'string') return false;
        }
        this.node.AlwaysExec.PlaySounds = value;
      }
    },
    actionTypes: {
      get() {
        return ['Speech', 'Set Zone'];
      },
      set() {
        return;
      }
    }
  },
  methods: {
    addActionSpeech() {
      let newDialog = {
        SoundType: 0,
        Val: ''
      };
      this.node.AlwaysExec.PlaySounds.push(newDialog);
    },
    addActionSetZone() {
      this.node.AlwaysExec.SetZone = 1;
    },
    addEntry() {
      this.node.EntryInput.push('');
    },
    save() {
      if (!this.isNew) {
        this.$store.dispatch('updateDialog', this.node);
      } else {
        this.$store.dispatch('createNewDialog', this.node);
      }
    },
    deleteAction(type, index) {
      this.node.AlwaysExec[type].splice(index, 1);
    }
  }
};
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
