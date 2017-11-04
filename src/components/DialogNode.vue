<template lang="pug">
  .DialogNode
    .wrap(
      :class="nodeClass"
      :id="`dialog-${dialog.ID}`"
      ref="dialog"
    )

      //- Not editing
      template(v-if="!isEditing")
        .cover-wrap

          //- Hover cover
          .cover.opaque(v-if="$store.state.connectingDialogID === dialog.ID")
            h1 connecting
          .cover.opaque(v-else-if="$store.state.previewConnect === dialog.ID")
            h1 previewing connect
          .cover(
            v-else-if="$store.state.connectingDialogID"
            @click="$emit('click')")
            h1(v-if="!isSelected")
              IconButton(name="link")
              | preview connect
          .cover(
            v-else
            @click="$emit('click')"
            :class="isSelected ? 'selected' : ''")
            h1(v-if="!isSelected")
              IconButton(name="search")
              | &nbsp;select
          //- Edit bar
          template(v-if="$store.state.connectingDialogID === dialog.ID")
          template(v-else-if="$store.state.connectingDialogID")
            .edit-bar(:class="$store.state.dialogEditError[dialog.ID] ? 'with-error' : ''")
              .button-grid-small
                IconButton(
                  :style="{ width: '100%' }"
                  name="link"
                  label="confirm connect"
                  @click.native="beginConnect()")
          template(v-else)
            .edit-bar(:class="$store.state.dialogEditError[dialog.ID] ? 'with-error' : ''")
              .button-grid-small
                IconButton(name="pencil" label="edit" @click.native="beginEdit()")
                IconButton(name="link" label="connect" @click.native="beginConnect()")

      //- Editing
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
          h3 The user should say one of the following:
          .entry(v-for="(entry, index) in $store.state.dialogEditingCopy[dialog.ID].EntryInput" :class="isChildIteration ? 'child' : ''")
            input(v-model="$store.state.dialogEditingCopy[dialog.ID].EntryInput[index]")
            IconButton(
              v-if="$store.state.dialogEditingCopy[dialog.ID].EntryInput.length > 1"
              name="times"
              flat
              @click.native="$store.state.dialogEditingCopy[dialog.ID].EntryInput.splice(index, 1)")
            span(v-if="index < $store.state.dialogEditingCopy[dialog.ID].EntryInput.length-1")
          IconButton(
            label="user should say"
            name="plus"
            @click.native="addEntryInput()")
          .ai-wrap
            h3 Your AI replies with all of the following:
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
                  label="ai says"
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
      .after-values-space(
        v-if='dialog.ChildDialogIDs && dialog.ChildDialogIDs.length'
        :style="{ width: `${calculateChildrenWidth()}px`, height: `${tallest - height + 50}px` }")
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
          @click.native="$store.dispatch('startNewConversation', dialogChain.slice(-1).pop())"
          isChildIteration="true")
          IconButton(name="plus" flat)
          | new
      DummyNode(
        v-else-if="!$store.state.newDialog"
        @click.native="$store.dispatch('startNewConversation', dialogChain.slice(-1).pop())"
        isChildIteration="true")
        IconButton(name="plus" flat)
        | new
</template>

<script>
import Vue from 'vue';
import DummyNode from './DummyNode';
import classNames from 'classNames';

export default {
  name: 'DialogNode',
  props: ['dialog', 'isChildIteration', 'recurse', 'isSelected', 'tallest'],
  components: {
    DummyNode
  },
  data() {
    return {
      height: 0,
      nodeClass: classNames('dialog-node', {
        'selectable': this.$route.params.dialog_id !== this.dialog.ID,
        'selected-node': this.isSelected || this.$store.state.dialogIsEditing === this.dialog.ID
      })
    };
  },
  activated() {
    const rect = this.$refs.dialog.getBoundingClientRect();
    this.height = rect.height;
    this.$emit('change-height', rect.height);
  },
  mounted() {
    const rect = this.$refs.dialog.getBoundingClientRect();
    this.height = rect.height;
    this.$emit('change-height', rect.height);
  },
  updated() {
    Vue.nextTick(() => {
      if (!this.$refs.dialog) return;
      const rect = this.$refs.dialog.getBoundingClientRect();
      this.height = rect.height;
      this.$emit('change-height', rect.height);
    });
  },
  computed: {
    dialogs() {
      return this.$store.state.dialogMap || {};
    },
    isEditing() {
      return this.$store.state.dialogIsEditing === this.dialog.ID;
    },
    dialogChain() {
      return this.$store.state.dialogChain[this.$store.state.selectedEntity.data.ID] || [];
    }
  },
  methods: {
    beginConnect() {
      this.$emit('click');
      this.$store.dispatch('beginConnectDialog', this.dialog.ID);
    },
    calculateChildrenWidth() {
      if (!this.dialog.ChildDialogIDs) return 1;
      let newDialogOffset = this.$store.state.newDialog ? 1 : 0;
      return ((this.dialog.ChildDialogIDs.length - newDialogOffset) * 400) + 1;
    },
    beginEdit() {
      this.$store.dispatch('editDialog', this.dialog.ID);
    },
    cancelEdit() {
      if (this.$store.state.newDialog.ID === this.dialog.ID) {
        Vue.nextTick(() => {
          this.$emit('change-height', 0);
        });
      }
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
</style>
