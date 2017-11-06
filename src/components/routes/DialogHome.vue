<template lang="pug">
  #RouteDialogHome
    sidebar
    paper(:transparent="true")
      paper-text
        .Form
          h1 user says
          .inner-values
            div.wide
              input.quoted(v-for="(entry, index) of dialog.EntryInput" :key="index" v-model="dialog.EntryInput[index]" placeholder="Enter something here...")
              w-button(@click.native="deleteAction('PlaySounds', index)") Delete
          div.right
            w-button(@click.native="addEntry") +

        hr
        .Form
          h1 ai replies
          .dialog-values(v-for="(sound, index) of dialog.AlwaysExec.PlaySounds" :key="`sound-${dialog.ID}-${index}`")
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
          .dialog-wrapper
            div(
              @click="$router.push({ name: 'DialogHome', params: { id: $route.params.id, dialog_id: dialogID }})"
              v-for="dialogID of dialog.ChildDialogIDs"
              :key="dialogID"
            )
              dialog-dialog(:dialog='dialogs[dialogID]')
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
    dialog() {
      if (this.isNew) return this.$store.state.newDialog;
      return this.$store.state.dialogMap[this.$route.params.dialog_id];
    },
    dialogs() {
      return this.$store.state.dialogMap;
    },
    actionSpeech: {
      get() {
        return this.dialog.AlwaysExec.PlaySounds;
      },
      set(value) {
        for (let v of value) {
          if (typeof v === 'string') return false;
        }
        this.dialog.AlwaysExec.PlaySounds = value;
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
      this.dialog.AlwaysExec.PlaySounds.push(newDialog);
    },
    addActionSetZone() {
      this.dialog.AlwaysExec.SetZone = 1;
    },
    addEntry() {
      this.dialog.EntryInput.push('');
    },
    save() {
      if (!this.isNew) {
        this.$store.dispatch('updateDialog', this.dialog);
      } else {
        this.$store.dispatch('createNewDialog', this.dialog).then(() => {
          this.$router.push({ name: 'ActorDialog', params: { id: this.$route.params.id } });
        });
      }
    },
    deleteAction(type, index) {
      this.dialog.AlwaysExec[type].splice(index, 1);
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
  .dialog-wrapper {
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
