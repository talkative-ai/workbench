<template lang="pug">
  .DialogNode
    .wrap(
      :class=`{
        'dialog-node': true,
        'selectable': $route.params.dialog_id !== dialog.ID,
        'selected-node': isSelected || $store.state.dialogIsEditing === dialog.ID
      }`
      :id="`dialog-${dialog.ID}`"
      ref="dialog"
    )

      //- Not editing
      template(v-if="!isEditing")
        .cover-wrap

          //- Hover cover
          .cover.opaque(
            v-if="$store.state.connectingDialogID === dialog.ID"
            @click="$emit('click', { dialogID: dialog.ID })"
            )
            h1 connecting
          .cover.opaque(v-else-if="$store.state.previewConnect === dialog.ID")
            h1 previewing connect
          .cover(
            v-else-if="$store.state.connectingDialogID && !$store.state.dialogMap[$store.state.connectingDialogID].ChildDialogIDs.includes(dialog.ID)"
            @click="$emit('click', { dialogID: dialog.ID })")
            h1(v-if="!isSelected")
              IconButton(name="link")
              | preview connect
          .cover(
            v-else
            @click="$emit('click', { dialogID: dialog.ID })"
            :class=`{
              selected: isSelected
            }`)
            h1(v-if="!isSelected")
              IconButton(name="search")
              | &nbsp;select
          //- Edit bar
          template(v-if="$store.state.connectingDialogID")
          template(v-else)
            .edit-bar(
              :class=`{
                'with-error': $store.state.dialogEditError[dialog.ID]
              }`)
              .button-grid-small
                IconButton(name="pencil" label="edit" @click.native="beginEdit()")
                IconButton(name="link" label="connect" @click.native="beginConnect()")

      //- Editing
      template(v-else)
        .cover.editing

      .vspacer(v-if="parentNode")
      .ball(v-if="parentNode")
      .entry-wrap

        //- Not editing
        template(v-if="!isEditing")
          .entry(v-for="(entry, index) in dialog.EntryInput" :class="{ 'child': parentNode }")
            | {{ dialog.EntryInput[index] }}
            span(v-if="index < dialog.EntryInput.length-1")
              | ,
          .dialog-values
            .inner-values.actor-vals(v-for='(sound, index) of dialog.AlwaysExec.PlaySounds', :key='`sound-${dialog.ID}-${index}`')
              | "{{ sound.Val }}"
            .actions(v-if='dialog.ChildDialogIDs && dialog.ChildDialogIDs.length')
              | await response
            .actions.dialog-action(
              v-else
              :class="{ [dialogAction]: true }")
              | {{ dialogActionFriendly }}

        //- Editing
        template(v-else)
          h3 The user should say one of the following:
          .entry(v-for="(entry, index) in $store.state.dialogEditingCopy[dialog.ID].EntryInput" :class="{ 'child': parentNode }")
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
                .flex.flex-column
                  IconButton(
                    name="plus"
                    label="ai says"
                    @click.native="addPlaySound()"
                    )
              .actions(v-if='dialog.ChildDialogIDs && dialog.ChildDialogIDs.length')
                | await response
              select.actions.dialog-action(
                v-else
                :class="{ [dialogAction]: true }"
                :value="dialogAction"
                @change="updateAction")
                option(value="end-conversation") end conversation
                option(value="go-to-zone") go to zone
              select(
                v-if="dialogAction === 'go-to-zone'"
                :value="$store.state.dialogEditingCopy[dialog.ID].AlwaysExec.SetZone"
                @change="updateZone"
                )
                option(
                  v-for="(value, index) of $store.state.zoneMap"
                  :value="value.ID"
                  )
                  | {{value.Title}}
          .edit-bar(
            :class=`{
              'with-error': $store.state.dialogEditError[dialog.ID]
            }`)
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
            :parentNode="dialog.ID",
            :recurse='false'
            @click="$emit('click-child', { dialogID, isChild: true })"
            @click-child="$emit('click-child', { dialogID, isChild: true })"
          )
        DummyNode(
          v-if="!$store.state.newDialog && !$store.state.connectingDialogID"
          @click.native="$store.dispatch('startNewConversation', dialogChain.slice(-1).pop())"
          :parentNode="dialog.ID")
          IconButton(name="plus" flat)
          | new
      DummyNode(
        v-else-if="!$store.state.newDialog && !$store.state.connectingDialogID"
        @click.native="$store.dispatch('startNewConversation', dialogChain.slice(-1).pop())"
        :parentNode="dialog.ID")
        IconButton(name="plus" flat)
        | new
</template>

<script>
import Vue from 'vue';
import DummyNode from './DummyNode';

export default {
  name: 'DialogNode',
  props: ['dialog', 'parentNode', 'recurse', 'isSelected', 'tallest'],
  components: {
    DummyNode
  },
  data() {
    return {
      height: 0
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
    },
    dialogAction() {
      if (!this.$store.state.dialogEditingCopy[this.dialog.ID]) return 'end-conversation';

      if (this.$store.state.dialogEditingCopy[this.dialog.ID].action) {
        return this.$store.state.dialogEditingCopy[this.dialog.ID].action;
      }

      if (this.$store.state.dialogEditingCopy[this.dialog.ID].AlwaysExec.SetZone > 0) {
        return 'go-to-zone';
      }

      return 'end-conversation';
    },
    dialogActionFriendly() {
      return this.dialogAction.replace(/-/g, ' ');
    }
  },
  methods: {
    beginConnect() {
      this.$emit('click', { dialogID: this.dialog.ID });
      this.$store.dispatch('beginConnectDialog', this.dialog.ID);
    },
    calculateChildrenWidth() {
      if (!this.dialog.ChildDialogIDs) return 1;
      let newDialogOffset = this.$store.state.newDialog || this.$store.state.connectingDialogID ? 1 : 0;
      return ((this.dialog.ChildDialogIDs.length - newDialogOffset) * 400);
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
    },
    updateAction(action) {
      this.$store.commit('setDialogAction', { dialogID: this.dialog.ID, action: action.target.value });
      if (action.target.value === 'end-conversation') {
        this.$store.commit('setDialogZone', { dialogID: this.dialog.ID, zoneID: 0 });
      }
    },
    updateZone(action) {
      this.$store.commit('setDialogZone', { dialogID: this.dialog.ID, zoneID: action.target.value });
    }
  }
};
</script>

<style lang="scss">
</style>
