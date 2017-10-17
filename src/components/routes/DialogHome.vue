<template lang="pug">
  #RouteDialogHome
    sidebar
    paper(:transparent="true")
      paper-text
        .Form
          h1 user says
          .inner-values
            div.wide
              input.quoted(v-for="(entry, index) of node.EntryInput" :key="index" v-model="node.EntryInput[index]")
              w-button(@click.native="deleteAction('PlaySounds', index)") Delete
          div.right
            w-button(@click.native="addEntry") +

        hr
        .Form
          h1 ai replies
          .node-values(v-for="(sound, index) of node.AlwaysExec.PlaySounds" :key="`sound-${node.ID}-${index}`")
            .inner-values
              | Synthesized Speech
              div.wide
                input(placeholder="Enter speech text here!" v-model="sound.Val")
                w-button(@click.native="deleteAction('PlaySounds', index)") Delete
          div.right
            w-button(@click.native="addActionSpeech()")
              | +
        hr

        .Form
          h1 followup dialogs
          .node-wrapper
            div(
              @click="$router.push({ name: 'DialogHome', params: { id: $route.params.id, dialog_id: nodeID }})"
              v-for="nodeID of node.ChildNodes"
              :key="nodeID"
            )
              dialog-node(:node='dialogs[nodeID]')
          .Form.button-grid(v-if="!this.isNew")
            w-button(
              @click.native="$router.push({ name: 'DialogCreate', params: { id: $route.params.id, dialog_id: $route.params.dialog_id, is_root: false }})"
            )
              | Create New Response Dialog
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
import DialogNode from '../DialogNode';
import PaperText from '../elements/PaperText';
import PaperPath from '../elements/PaperPath';

export default {
  name: 'DialogHome',
  components: {
    Sidebar,
    Paper,
    WButton,
    DialogNode,
    PaperText,
    PaperPath
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
      console.log(this.$store.state.dialogsMapped[this.$route.params.dialog_id]);
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
        this.$store.dispatch('createNewDialog', this.node).then(() => {
          this.$router.push({ name: 'ActorDialog', params: { id: this.$route.params.id } });
        });
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
  h1, h2 {
    margin-bottom: 20pt;
    margin-left: -20pt;
    font-size: 15pt;
  }
  .Canvas {
    padding: 3rem;
  }

  .right {
    text-align: right;
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
    flex-direction: column;
    .Button {
      opacity: 0;
    }
    &:hover {
      .Button {
        opacity: 1;
      }
    }
  }

  input {
    border: none;
    font-size: 2rem;
  }

  .wide {
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
  .node-wrapper {
    display: flex;
  }
  h3 {
    flex: 1;
  }

  hr {
    color: $purple;
  }
}
</style>
