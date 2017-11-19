<template>
  <div class="DialogNode">
    <div
      class="wrap"
      :class="{
        'dialog-node': true,
        'selectable': $route.params.dialog_id !== dialog.ID,
        'selected-node': isSelected || dialogEditingID === dialog.ID
      }"
      :id="`dialog-${dialog.ID}`"
      ref="dialog">
      <template v-if="!isEditing">
        <div class="cover-wrap">
          <div class="cover opaque" v-if="connectingFromDialogID === dialog.ID" @click="$emit('click', { dialogID: dialog.ID })">
            <h1>connecting</h1>
          </div>
          <div class="cover opaque" v-else-if="connectingToDialogID === dialog.ID">
            <h1>previewing connect</h1>
          </div>
          <div class="cover" v-else-if="connectingFromDialogID && !dialogs[connectingFromDialogID].ChildDialogIDs.includes(dialog.ID)"
            @click="$emit('click', { dialogID: dialog.ID })">
            <h1 v-if="!isSelected">
              <IconButton name="link"></IconButton>preview connect</h1>
          </div>
          <div class="cover" v-else @click="$emit('click', { dialogID: dialog.ID })" :class="{
                selected: isSelected
              }">
            <h1 v-if="!isSelected">
              <IconButton name="search"></IconButton>&nbsp;select</h1>
          </div>
          <template v-if="connectingFromDialogID"></template>
          <template v-else>
            <div class="edit-bar" :class="{
                  'with-error': dialogEditError
                }">
              <div class="button-grid-small">
                <IconButton name="pencil" label="edit" @click.native="beginEdit()"></IconButton>
                <IconButton name="link" label="connect" @click.native="beginConnect()"></IconButton>
              </div>
            </div>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="cover editing"></div>
      </template>
      <div class="vspacer" v-if="parentNode"></div>
      <div class="ball" v-if="parentNode"></div>
      <div class="entry-wrap">
        <template v-if="!isEditing">
          <div
            class="entry"
            v-for="(entry, index) in dialog.EntryInput"
            :key="index"
            :class="{ 'child': parentNode }">
            {{ dialog.EntryInput[index] }}
            <span v-if="index < dialog.EntryInput.length-1">,</span>
          </div>
          <div class="dialog-values">
            <div class="inner-values actor-vals" v-for="(sound, index) of dialog.AlwaysExec.PlaySounds" :key="`sound-${dialog.ID}-${index}`">"{{ sound.Val }}"</div>
            <div class="actions" v-if="dialog.ChildDialogIDs && dialog.ChildDialogIDs.length">await response</div>
            <div class="actions dialog-action" v-else :class="{ [dialogAction]: true }">{{ dialogActionFriendly }}</div>
          </div>
        </template>
        <template v-else>
          <h3>The user should say one of the following:</h3>
          <div
            class="entry"
            v-for="(entry, index) in dialogEditingCopy.EntryInput"
            :key="index"
            :class="{ 'child': parentNode }">
            <input v-model="dialogEditingCopy.EntryInput[index]" />
            <IconButton v-if="dialogEditingCopy.EntryInput.length > 1" name="times" flat="flat" @click.native="dialogEditingCopy.EntryInput.splice(index, 1)"></IconButton>
            <span v-if="index < dialogEditingCopy.EntryInput.length-1"></span>
          </div>
          <IconButton label="user should say" name="plus" @click.native="addEntryInput()"></IconButton>
          <div class="ai-wrap">
            <h3>Your AI replies with all of the following:</h3>
            <div class="dialog-values">
              <div class="inner-values actor-vals" v-for="(sound, index) of dialogEditingCopy.AlwaysExec.PlaySounds"
                :key="`sound-${dialog.ID}-${index}`">
                <input v-model="sound.Val" />
                <IconButton
                  v-if="dialogEditingCopy.AlwaysExec.PlaySounds.length > 1"
                  name="times"
                  flat="flat"
                  @click.native="dialogEditingCopy.AlwaysExec.PlaySounds.splice(index, 1)"></IconButton>
              </div>
              <div class="inner-values actor-vals">
                <div class="flex flex-column">
                  <IconButton name="plus" label="ai says" @click.native="addPlaySound()"></IconButton>
                </div>
              </div>
              <div class="actions" v-if="dialog.ChildDialogIDs && dialog.ChildDialogIDs.length">await response</div>
              <select class="actions dialog-action" v-else :class="{ [dialogAction]: true }" :value="dialogAction" @change="updateAction">
                <option value="end-conversation">end conversation</option>
                <option value="go-to-zone">go to zone</option>
              </select>
              <select v-if="dialogAction === 'go-to-zone'" :value="dialogEditingCopy.AlwaysExec.SetZone" @change="updateZone">
                <option
                  v-for="(value, index) of zones"
                  :key="index"
                  :value="value.ID">{{value.Title}}</option>
              </select>
            </div>
          </div>
          <div class="edit-bar" :class="{
                'with-error': dialogEditError
              }">
            <div class="button-grid-small">
              <IconButton @click.native="saveEdit()" label="save"></IconButton>
              <IconButton @click.native="cancelEdit()" label="cancel"></IconButton>
            </div>
            <div class="error" v-if="dialogEditError">{{dialogEditError}}</div>
          </div>
        </template>
      </div>
    </div>
    <template v-if="recurse">
      <div class="after-values-space" v-if="dialog.ChildDialogIDs && dialog.ChildDialogIDs.length" :style="{ width: `${calculateChildrenWidth()}px`, height: `${tallest - height + 50}px` }"></div>
      <div class="child-dialogs" v-if="dialog.ChildDialogIDs && dialog.ChildDialogIDs.length">
        <div v-for="(dialogID, idx) of dialog.ChildDialogIDs" :key="dialogID">
          <DialogNode :dialog="dialogs[dialogID]" :parentNode="dialog.ID" :recurse="false" @click="$emit('click-child', { dialogID, isChild: true })"
            @click-child="$emit('click-child', { dialogID, isChild: true })"></DialogNode>
        </div>
        <DummyNode v-if="!newDialog && !connectingFromDialogID" @click.native="$store.dispatch('dialogs/startNewConversation', dialogChain.slice(-1).pop())"
          :parentNode="dialog.ID">
          <IconButton name="plus" flat="flat"></IconButton>new</DummyNode>
      </div>
      <DummyNode v-else-if="!newDialog && !connectingFromDialogID" @click.native="$store.dispatch('dialogs/startNewConversation', dialogChain.slice(-1).pop())"
        :parentNode="dialog.ID">
        <IconButton name="plus" flat="flat"></IconButton>new</DummyNode>
    </template>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapState } from 'vuex';

import DummyNode from './DummyNode';

export default {
  name: 'DialogNode',
  props: [
    'dialog',
    'parentNode',
    'recurse',
    'isSelected',
    'tallest'
  ],
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
    ...mapState('dialogs', {
      rootDialogs: 'rootDialogs',
      dialogs: 'dialogMap',
      connectingFromDialogID: 'connectingFromDialogID',
      connectingToDialogID: 'connectingToDialogID',
      newDialog: 'newDialog',
      dialogEditingID: 'dialogEditingID',
      dialogEditingCopy(state) {
        return state.dialogEditingCopy[this.dialog.ID];
      },
      dialogEditError(state) {
        return state.dialogEditError[this.dialog.ID];
      }
    }),
    ...mapState('zones', {
      zones: 'zoneMap'
    }),
    ...mapGetters('dialogs', {
      dialogChain: 'currentDialogChain'
    }),
    isEditing() {
      return this.dialogEditingID === this.dialog.ID;
    },
    dialogAction() {
      if (!this.dialogEditingCopy) return 'end-conversation';

      if (this.dialogEditingCopy.action) {
        return this.dialogEditingCopy.action;
      }

      if (this.dialogEditingCopy.AlwaysExec.SetZone > 0) {
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
      this.$store.dispatch('dialogs/beginConnectDialog', this.dialog.ID);
    },
    calculateChildrenWidth() {
      if (!this.dialog.ChildDialogIDs) return 1;
      let newDialogOffset = this.newDialog || this.connectingFromDialogID ? 1 : 0;
      return ((this.dialog.ChildDialogIDs.length - newDialogOffset) * 400);
    },
    beginEdit() {
      this.$store.dispatch('dialogs/editDialog', this.dialog.ID);
    },
    cancelEdit() {
      if (this.dialogEditingID === this.dialog.ID) {
        Vue.nextTick(() => {
          this.$emit('change-height', 0);
        });
      }
      this.$store.dispatch('dialogs/cancelEditDialog', this.dialog.ID);
    },
    saveEdit() {
      this.$store.dispatch('dialogs/saveEditDialog', this.dialog.ID);
    },
    addPlaySound() {
      this.dialogEditingCopy.AlwaysExec.PlaySounds.push({
        SoundType: 1,
        Val: ''
      });
    },
    addEntryInput() {
      this.dialogEditingCopy.EntryInput.push('');
    },
    updateAction(action) {
      this.$store.commit('dialogs/setDialogAction', { dialogID: this.dialog.ID, action: action.target.value });
      if (action.target.value === 'end-conversation') {
        this.$store.commit('dialogs/setDialogZone', { dialogID: this.dialog.ID, zoneID: 0 });
      }
    },
    updateZone(action) {
      this.$store.commit('dialogs/setDialogZone', { dialogID: this.dialog.ID, zoneID: action.target.value });
    }
  }
};
</script>

<style lang="scss">
</style>
