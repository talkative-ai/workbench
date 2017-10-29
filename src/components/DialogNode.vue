<template lang="pug">
  .DialogNode
    .wrap(
      :class="`${$route.params.dialog_id !== dialog.ID ? 'selectable' : ''}`"
      :id="`dialog-dialog-${dialog.ID}`"
      ref="dialog"
    )
      template(v-if="!isEditing")
        .cover-wrap

          //- Hover cover
          .cover(
            v-if="!$route.params.linking_child"
            @click="$emit('click')"
            :class="isSelected ? 'selected' : ''")
            h1(v-if="!isSelected")
              IconButton(name="search")
              | &nbsp;select
          .cover(
            v-else-if="$route.params.dialog_id !== dialog.ID"
            @click="$emit('click')")
            h1 link dialog
          .cover.opaque(v-else)
            h1 linking

          //- Edit bar
          .button-grid-small.edit-bar
            IconButton(name="pencil" label="edit" @click.native="beginEdit()")
            IconButton(name="link" label="connect")
      template(v-else)
        .cover.editing
      .vspacer(v-if="isChildIteration")
      .ball(v-if="isChildIteration")
      .entry-wrap

        //- Not editing
        template(v-if="!isEditing")
          .entry(v-for="(entry, index) in dialog.EntryInput" :class="isChildIteration ? 'child' : ''")
            | {{ dialog.EntryInput[index] }}
            span(v-if="index < dialog.EntryInput.length-1")
              | ,
          .dialog-values
            .inner-values.actor-vals(v-for='(sound, index) of dialog.AlwaysExec.PlaySounds', :key='`sound-${dialog.ID}-${index}`')
              | "{{ sound.Val }}"
            .actions(v-if='dialog.ChildDialogIDs && dialog.ChildDialogIDs.length')
              | await response
            .actions.black(v-else)
              | end conversation

        //- Editing
        template(v-else)
          .entry(v-for="(entry, index) in $store.state.dialogEditingCopy[dialog.ID].EntryInput" :class="isChildIteration ? 'child' : ''")
            input(v-model="$store.state.dialogEditingCopy[dialog.ID].EntryInput[index]")
            IconButton(
              v-if="$store.state.dialogEditingCopy[dialog.ID].EntryInput.length > 1"
              name="times"
              flat
              @click.native="$store.state.dialogEditingCopy[dialog.ID].EntryInput.splice(index, 1)")
            span(v-if="index < $store.state.dialogEditingCopy[dialog.ID].EntryInput.length-1")
          IconButton(
            name="plus"
            @click.native="addEntryInput()")
          br
          .dialog-values
            .inner-values.actor-vals(
              v-for='(sound, index) of $store.state.dialogEditingCopy[dialog.ID].AlwaysExec.PlaySounds'
              :key='`sound-${dialog.ID}-${index}`')
              input(v-model="sound.Val")
              IconButton(
                v-if="$store.state.dialogEditingCopy[dialog.ID].AlwaysExec.PlaySounds.length > 1"
                name="times"
                flat
                @click.native="$store.state.dialogEditingCopy[dialog.ID].AlwaysExec.PlaySounds.splice(index, 1)")
            .inner-values.actor-vals
              IconButton(
                name="plus"
                @click.native="addPlaySound()"
                )
            .actions(v-if='dialog.ChildDialogIDs && dialog.ChildDialogIDs.length')
              | await response
            .actions.black(v-else)
              | end conversation
          .edit-bar(:class="$store.state.dialogEditError[dialog.ID] ? 'with-error' : ''")
            .button-grid-small
              IconButton(@click.native="saveEdit()" label="save")
              IconButton(@click.native="cancelEdit()" label="cancel")
            .error(v-if="$store.state.dialogEditError[dialog.ID]")
              | {{$store.state.dialogEditError[dialog.ID]}}
    template(v-if="recurse")
      .after-values-space(v-if='dialog.ChildDialogIDs && dialog.ChildDialogIDs.length' :style="{ width: `${calculateWidth()}px`, height: `${tallest - height + 35}px` }")
      .child-dialogs(v-if='dialog.ChildDialogIDs && dialog.ChildDialogIDs.length')
        div(v-for='(dialogID, idx) of dialog.ChildDialogIDs', :key='dialogID')
          DialogNode(
            :dialog='dialogs[dialogID]',
            isChildIteration="true",
            :recurse='false'
            @click="$emit('click-child', { dialogID, isChild: true })"
            @click-child="$emit('click-child', { dialogID, isChild: true })"
          )
        DummyNode(
          v-if="!$store.state.newDialog"
          @click.native="$store.dispatch('startNewConversation', dialog.ID)"
          isChildIteration="true")
          IconButton(name="plus" flat)
          | new
      DummyNode(
        v-else-if="!$store.state.newDialog"
        @click.native="$store.dispatch('startNewConversation', dialog.ID)"
        isChildIteration="true")
        IconButton(name="plus" flat)
        | new
</template>

<script>
import DummyNode from './DummyNode';
export default {
  name: 'DialogNode',
  props: ['dialog', 'isChildIteration', 'recurse', 'isSelected', 'resolve', 'tallest', 'newConversation'],
  components: {
    DummyNode
  },
  data() {
    return {
      height: 0
    };
  },
  mounted() {
    const rect = this.$refs.dialog.getBoundingClientRect();
    this.height = rect.height;
    if (this.resolve) {
      this.resolve(rect);
    }
  },
  computed: {
    dialogs() {
      return this.$store.state.dialogMap || {};
    },
    isEditing() {
      return this.$store.state.dialogIsEditing[this.dialog.ID];
    }
  },
  methods: {
    calculateWidth() {
      if (!this.dialog.ChildDialogIDs) return 1;
      return ((this.dialog.ChildDialogIDs.length) * 400) + 1;
    },
    beginEdit() {
      this.$store.dispatch('editDialog', this.dialog.ID);
    },
    cancelEdit() {
      this.$store.dispatch('cancelEditDialog', this.dialog.ID);
    },
    saveEdit() {
      this.$store.dispatch('saveEditDialog', this.dialog.ID);
    },
    addPlaySound() {
      this.$store.state.dialogEditingCopy[this.dialog.ID].AlwaysExec.PlaySounds.push({
        SoundType: 1,
        Val: ''
      });
    },
    addEntryInput() {
      this.$store.state.dialogEditingCopy[this.dialog.ID].EntryInput.push('');
    }
  }
};
</script>

<style lang="scss">
.DialogNode {
  display: inline-flex;
  flex-direction: column;
  user-select: none;
  margin-top: -1px;
  min-width: 400px;
  max-width: 400px;
}
.button-grid {
  padding: 10pt 0px;
}
.cover {
  position: absolute;
  top: -1px;
  bottom: -1px;
  left: -1px;
  width: 401px;
  z-index: 10;
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  &.editing {
    opacity: 1;
    border: 2px dashed $purple;
    pointer-events: none;
    flex-direction: column;
  }
  h1 {
    color: $purple;
  }
  &.opaque {
    opacity: 1;
    cursor: default;
    border: 1px solid $purple;
    background-color: var(--color-paper-low-opacity);
  }
}
.selected {
  border: 1px solid $purple;
  opacity: 1;
}
.cover-wrap {
  position: absolute;
  top: 0px;
  bottom: -1px;
  left: -1px;
  z-index: 10;
  .edit-bar {
    opacity: 0;
  }
  &:hover {
    z-index: 20;
    .cover {
      opacity: 1;
      border: 1px solid $purple;
      background-color: var(--color-paper-low-opacity);
      cursor: pointer;
      &.selected {
        cursor: default;
      }
    }
    .edit-bar {
      opacity: 1;
    }
  }
}
.edit-bar {
  bottom: -31pt;
  position: absolute;
  left: 0;
  right: 0;
  width: 400px;
  height: 30pt;
  &.with-error {
    height: 60pt;
    bottom: -61pt;
    align-items: baseline;
    justify-content: space-between;
    padding: 10pt;
    flex-direction: column;
  }
  .error {
    display: flex;
    align-items: center;
    width: 100%;
    background-color: pink;
    color: black;
    font-weight: bold;
    padding: 0 5pt;
  }
  display: flex;
  align-items: center;
  background-color: var(--color-paper);
  box-shadow: 0 0 5pt rgba(0,0,0,0.2);
  padding-left: 10pt;
  z-index: 100;
}
.vspacer {
  height: 20pt;
  border-left: 1px solid $purple;
  margin-top: -1px;
}
.actor-vals {
  color: $purple;
  border-left: 1px solid $purple;
}
.actions {
  cursor: default;
  pointer-events: none;
  display: inline-block;
  padding: 0.25rem;
  background-color: $purple;
  color: white;
}
.after-values-space {
  border-left: 1px solid $purple;
  border-bottom: 1px solid $purple;
  margin-left: 11pt;
  margin-top: -1pt;
}
.ball {
  width: 0.25rem;
  height: 0.25rem;
  border: 0.25rem solid $purple;
  border-radius: 100%;
  position: absolute;
  display: inline-block;
  margin-left: -0.25rem;
  margin-top: -0.25rem;
}
.child-dialog-head {
  position: relative;
  margin: 0 0 1rem 0.25rem;
}
.wrap {
  padding-left: 10pt;
  border: 1px solid transparent;
  position: relative;
}
.inner-values {
  padding: 0.25rem;
  padding: 5pt 0.25rem 10pt 0.25rem;
}
.child-dialogs {
  display: flex;
}
.child-dialog-head-nth {
  border-top: 1px solid $purple;
}
.entry {
  position: relative;
  left: -10pt;
  padding: 5pt 0;
}
.black {
  background-color: black;
}
</style>
