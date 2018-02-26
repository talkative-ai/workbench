<template>

  <div v-if="dummy" class="Dialogue">
    <div class="wrap" style="height: 100px;" ref="dialog">
      <div class="vspacer" v-if="parentNode"></div>
      <div class="ball" v-if="parentNode"></div>
      <div class="cover-wrap">
        <div
          class="cover opaque no-border"
          @click="$emit('click', { $event })">
          <h1>
            <slot></slot>
          </h1>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="Dialogue">
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
          <div class="cover opaque" v-else-if="disconnectingToDialogID === dialog.ID">
            <h1 class="danger">disconnecting</h1>
          </div>
          <div class="cover" v-else-if="isConnectable()"
            @click="$emit('click', { $event, dialogID: dialog.ID, previewConnect: true })">
            <h1 v-if="!isSelected">
              <IconButton name="link" />preview connect
            </h1>
          </div>
          <div
            class="cover"
            v-else
            @click="$emit('click', { $event, dialogID: dialog.ID })"
            :class="{
              selected: isSelected
            }">
            <template v-if="!isSelected">
              <h1 class="danger" v-if="disconnectingFromDialogID">
                <IconButton class="danger" name="chain-broken" />
                &nbsp;disconnect
              </h1>
              <h1 v-else>
                <IconButton name="search" />
                &nbsp;select
              </h1>
            </template>
          </div>
          <template v-if="connectingFromDialogID"></template>
          <template v-else>
            <div
              v-if="!hideTools"
              class="toolbox" :class="{
                  'with-error': dialogEditError
                }">
              <div class="button-grid-small">
                <IconButton
                  shrinky="true"
                  name="pencil"
                  label="edit"
                  @click="beginEdit()" />
                <IconButton
                  shrinky="true"
                  name="link"
                  label="connect"
                  @click="beginConnect()" />
                <div class="hspacer" />
                <IconButton
                  v-if="disconnectChildDialogIDs().length"
                  shrinky="true"
                  class="danger"
                  name="chain-broken"
                  label="disconnect"
                  @click="beginDisconnect()" />
                <IconButton
                  shrinky="true"
                  class="danger"
                  name="trash"
                  label="delete"
                  @click="stageDeleteDialog()" />
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
      <div :class="{
        'entry-wrap': true,
        'editing': isEditing
      }">
        <template v-if="!isEditing">
          <template v-if="!dialog.UnknownHandler">
            <div
              class="entry"
              v-for="(entry, index) in dialog.EntryInput"
              :key="index"
              :class="{ 'child': parentNode }">
              {{ dialog.EntryInput[index] }}
              <span v-if="index < dialog.EntryInput.length-1">,</span>
            </div>
          </template>
          <template v-else>
            <div
            class="entry any">
              (Anything else the user says leads here)
            </div>
          </template>
          <div class="dialog-values">
            <div class="inner-values actor-vals" v-for="(sound, index) of dialog.AlwaysExec.PlaySounds" :key="`sound-${dialog.ID}-${index}`">"{{ sound.Val }}"</div>
            <div class="actions" v-if="childDialogIDs && childDialogIDs.length">await response</div>
            <div class="actions dialog-action" v-else :class="{ [dialogAction]: true }">{{ dialogActionFriendly }}</div>
          </div>
        </template>
        <template v-else>
         <template v-if="!dialogEditingCopy.UnknownHandler">
            <h3>The user can say one of the following:</h3>
            <div
              class="entry"
              v-for="(entry, index) in dialogEditingCopy.EntryInput"
              :key="index"
              :class="{ 'child': parentNode }">
              <textarea
                v-autosize="dialogEditingCopy.EntryInput[index]"
                :id="`entry-text-area.${idHash}.${index}`"
                @keypress.enter="userEntryEnter(`entry-text-area.${idHash}.${index+1}`, $event)"
                :placeholder="`Example: Hello ${actor.Title}`"
                v-model="dialogEditingCopy.EntryInput[index]" />
              <IconButton v-if="dialogEditingCopy.EntryInput.length > 1" name="times" flat="flat" @click="dialogEditingCopy.EntryInput.splice(index, 1)" />
              <span v-if="index < dialogEditingCopy.EntryInput.length-1"></span>
            </div>
            <IconButton label="User can say" name="plus" @click="addEntryInput()" />
            <hr>
          </template>
          <div class="ai-wrap">
            <h3>{{ actor.Title }} replies with all of the following:</h3>
            <div class="dialog-values">
              <div class="inner-values actor-vals" v-for="(sound, index) of dialogEditingCopy.AlwaysExec.PlaySounds"
                :key="`sound-${dialog.ID}-${index}`">
                <textarea
                  v-autosize="dialogEditingCopy.EntryInput[index]"
                  :id="`sound.${idHash}.${index}`"
                  @keypress.enter="userPlaySoundEnter(`sound.${idHash}.${index+1}`, $event)"
                  placeholder="Example: Hello! Go ahead and ask me a question."
                  v-model="sound.Val" />
                <IconButton
                  v-if="dialogEditingCopy.AlwaysExec.PlaySounds.length > 1"
                  name="times"
                  flat="flat"
                  @click="dialogEditingCopy.AlwaysExec.PlaySounds.splice(index, 1)" />
              </div>
              <div class="inner-values actor-vals">
                <div class="flex flex-column">
                  <IconButton name="plus" :label="`${actor.Title} says`" @click="addPlaySound()" />
                </div>
              </div>
              <div class="actions" v-if="childDialogIDs && childDialogIDs.length">await response</div>
              <select v-else
                class="actions dialog-action"
                :class="{ [dialogAction]: true }"
                :value="dialogAction"
                @change="updateAction">
                <option value="end-conversation">end conversation</option>
                <option value="go-to-zone">go to zone</option>
                <option value="reset-app">reset app</option>
              </select>
              <select v-if="dialogAction === 'go-to-zone'" :value="dialogEditingCopy.AlwaysExec.SetZone" @change="updateZone">
                <option
                  v-for="(value, index) of zones"
                  :key="index"
                  :value="value.ID">{{value.Title}}</option>
              </select>
            </div>
          </div>
          <div
            v-if="!hideTools"
            class="toolbox"
            :class="{
                'with-error': dialogEditError
              }">
            <div class="button-grid-small">
              <IconButton @click="saveEdit()" label="save" />
              <IconButton @click="cancelEdit($event)" label="cancel" />
            </div>
            <div class="error" v-if="dialogEditError">{{dialogEditError}}</div>
          </div>
        </template>
      </div>
    </div>
    <template v-if="recurse">
      <ChildConnector
        v-if="childDialogIDs && childDialogIDs.length"
        :width="`${calculateChildrenWidth()}px`"
        :height="`${childConnectorHeight}px`" />
      <div class="child-dialogs" v-if="childDialogIDs && childDialogIDs.length">
        <div v-for="(dialogID, idx) of childDialogIDs" :key="`dialog.${idHash}.${idx}`" v-if="dialogID !== unknownHandlerDialogID">
          <Dialogue
            :actor="actor"
            :dialog="dialogs[dialogID]"
            :parentNode="dialog.ID"
            :recurse="false"
            :filterChildren="filterChildren"
            :filterDisconnectChildren="filterDisconnectChildren"
            :hideTools="hideTools"
            :hideSpecialDialogs="hideSpecialDialogs"
            :parentIdHash="idHash"
            @click="$emit('click-child', { $event: $event.$event || $event, dialogID, isChild: true })"
            @click-child="$emit('click-child', { $event: $event.$event || $event, dialogID, isChild: true })" />
        </div>
        <Dialogue
          dummy="true"
          v-if="showNewDialog"
          @click="newConversation({ parentDialogID: dialogChain.slice(-1).pop() })"
          :parentNode="dialog.ID">
          <IconButton name="plus" flat="flat" />continue conversation</Dialogue>
        <Dialogue
          dummy="true"
          v-if="showNewDialog && !unknownHandlerDialogID"
          @click="newConversation({ parentDialogID: dialogChain.slice(-1).pop(), unknownHandler: true })"
          :parentNode="dialog.ID">
          <IconButton name="plus" flat="flat" />anything else</Dialogue>
        <Dialogue
          v-if="unknownHandlerDialogID && (!disconnectingFromDialogID || dialogs[unknownHandlerDialogID].parentDialogIDs.length > 1)"
          :actor="actor"
          :dialog="dialogs[unknownHandlerDialogID]"
          :parentNode="dialog.ID"
          :recurse="false"
          :hideTools="hideTools"
          :hideSpecialDialogs="hideSpecialDialogs"
          :parentIdHash="idHash"
          @click="$emit('click-child', { $event: $event.$event || $event, dialogID: unknownHandlerDialogID, isChild: true })"
          @click-child="$emit('click-child', { $event: $event.$event || $event, dialogID: unknownHandlerDialogID, isChild: true })" />
      </div>
      <template v-else-if="showNewDialog">
        <ChildConnector
          :width="`${calculateChildrenWidth(2)}px`"
          :height="`${childConnectorHeight}px`" />
        <div class="child-dialogs">
          <Dialogue
            dummy="true"
            @click="newConversation({ parentDialogID: dialogChain.slice(-1).pop() })"
            :parentNode="dialog.ID">
            <IconButton name="plus" flat="flat" />continue conversation</Dialogue>
          <Dialogue
            dummy="true"
            v-if="!unknownHandlerDialogID && !hideSpecialDialogs"
            @click="newConversation({ parentDialogID: dialogChain.slice(-1).pop(), unknownHandler: true })"
            :parentNode="dialog.ID">
            <IconButton name="plus" flat="flat" />anything else</Dialogue>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapState } from 'vuex';
import ChildConnector from './ChildConnector';
import { NULL_UUID } from '../../const';

export default {
  name: 'Dialogue',
  components: {
    ChildConnector
  },
  props: [
    'dialog',
    'parentNode',
    'recurse',
    'isSelected',
    'tallest',
    'actor',
    'dummy',
    'filterChildren',
    'filterDisconnectChildren',
    'hideTools',
    'hideSpecialDialogs',
    'parentIdHash'
  ],
  data() {
    return {
      height: 0
    };
  },
  activated() {
    const rect = this.$refs.dialog.getBoundingClientRect();
    if (this.height !== rect.height) {
      this.height = rect.height;
      this.$emit('change-height', rect.height);
    }
  },
  mounted() {
    const rect = this.$refs.dialog.getBoundingClientRect();
    if (this.height !== rect.height) {
      this.height = rect.height;
      this.$emit('change-height', rect.height);
    }
  },
  updated() {
    Vue.nextTick(() => {
      if (!this.$refs.dialog) return;
      const rect = this.$refs.dialog.getBoundingClientRect();
      if (this.height !== rect.height) {
        this.height = rect.height;
        this.$emit('change-height', rect.height);
      }
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
      disconnectingFromDialogID: 'disconnectingFromDialogID',
      disconnectingToDialogID: 'disconnectingToDialogID',
      dialogEditingCopy(state) {
        return state.dialogEditingCopy[this.dialog.ID];
      },
      dialogEditError(state) {
        return state.dialogEditError[this.dialog.ID];
      },
      idHash() {
        return `${this.parentIdHash}.${this.dialog.ID}`;
      }
    }),
    ...mapState('zones', {
      zones: 'zoneMap'
    }),
    ...mapGetters('dialogs', {
      dialogChain: 'currentDialogChain'
    }),
    showNewDialog() {
      return !this.newDialog && !this.connectingFromDialogID && !this.hideTools && !this.disconnectingFromDialogID;
    },
    isEditing() {
      return this.dialogEditingID === this.dialog.ID;
    },
    dialogAction() {
      let d = this.dialogEditingCopy || this.dialog;

      if (d.action) {
        return d.action;
      }

      if (d.AlwaysExec.ResetApp) {
        return 'reset-app';
      }

      if (d.AlwaysExec.SetZone !== NULL_UUID && d.AlwaysExec.SetZone !== null) {
        return 'go-to-zone';
      }

      return 'end-conversation';
    },
    dialogActionFriendly() {
      return this.dialogAction.replace(/-/g, ' ');
    },
    childDialogIDs() {
      if (this.disconnectingFromDialogID) {
        return this.disconnectChildDialogIDs();
      }
      if (!this.filterChildren) {
        return this.dialog.childDialogIDs;
      }
      return this.dialog.childDialogIDs.filter(this.filterChildren);
    },
    unknownHandlerDialogID() {
      let dialog = this.dialog.childDialogIDs.find(id => {
        return this.dialogs[id].UnknownHandler;
      });
      return dialog;
    },
    childConnectorHeight() {
      return Math.max(this.tallest - this.height + 50, 50);
    }
  },
  methods: {
    beginConnect() {
      this.$emit('click', { dialogID: this.dialog.ID });
      this.$store.dispatch('dialogs/beginConnectDialog', this.dialog.ID);
    },
    beginDisconnect() {
      this.$emit('click', { dialogID: this.dialog.ID });
      this.$store.dispatch('dialogs/beginDisconnectDialog', this.dialog.ID);
    },
    calculateChildrenWidth(childrenCount) {
      let count = childrenCount || (this.childDialogIDs ? this.childDialogIDs.length : 0) || 0;
      if (!childrenCount) {
        if (this.showNewDialog) {
          count += 1;
        }
        if (!this.unknownHandlerDialogID && !this.disconnectingFromDialogID) {
          count += 1;
        }
      }
      return (count - 1) * 400;
    },
    beginEdit() {
      this.$store.dispatch('dialogs/editDialog', this.dialog.ID);
    },
    stageDeleteDialog() {
      this.$emit('click', { dialogID: this.dialog.ID });
      this.$store.dispatch('dialogs/stageDeletion', this.dialog.ID);
      this.$router.push({ name: 'DialogDeletion', params: this.$route.params });
    },
    cancelEdit() {
      if (this.dialogEditingID === this.dialog.ID) {
        Vue.nextTick(() => {
          this.$emit('change-height', 0);
        });
      }
      this.$store.dispatch('dialogs/cancelEditDialog');
    },
    saveEdit() {
      this.$store.dispatch('dialogs/saveEditDialog', this.dialog.ID);
    },
    addPlaySound() {
      this.dialogEditingCopy.AlwaysExec.PlaySounds.push({
        SoundType: 0,
        Val: ''
      });
    },
    addEntryInput() {
      this.dialogEditingCopy.EntryInput.push('');
    },
    updateAction(action) {
      this.$store.commit('dialogs/resetApp', { dialogID: this.dialog.ID, val: false });
      this.$store.commit('dialogs/clearSetDialogZone', { dialogID: this.dialog.ID });
      this.$store.commit('dialogs/setDialogAction', { dialogID: this.dialog.ID, action: action.target.value });
      if (action.target.value === 'reset-app') {
        this.$store.commit('dialogs/resetApp', { dialogID: this.dialog.ID, val: true });
      }
    },
    updateZone(action) {
      this.$store.commit('dialogs/setDialogZone', { dialogID: this.dialog.ID, zoneID: action.target.value });
    },
    disconnectChildDialogIDs() {
      if (!this.filterDisconnectChildren) {
        return [];
      }
      return this.dialog.childDialogIDs.filter(id => this.filterDisconnectChildren(id));
    },
    userEntryEnter(id, event) {
      event.preventDefault();
      let el = document.getElementById(id);
      if (el) {
        el.focus();
        return;
      }
      this.addEntryInput();
      Vue.nextTick(() => {
        document.getElementById(id).focus();
      });
    },
    userPlaySoundEnter(id, event) {
      event.preventDefault();
      let el = document.getElementById(id);
      if (el) {
        el.focus();
        return;
      }
      this.addPlaySound();
      Vue.nextTick(() => {
        document.getElementById(id).focus();
      });
    },
    newConversation({ parentDialogID, unknownHandler }) {
      if (!this.showNewDialog) return;
      this.$store.dispatch('dialogs/startNewConversation', { parentDialogID, unknownHandler });
    },
    isConnectable() {
      if (!this.connectingFromDialogID) {
        return false;
      }
      if (this.dialogs[this.connectingFromDialogID].childDialogIDs.includes(this.dialog.ID)) {
        return false;
      }
      if (this.dialog.UnknownHandler) {
        let hasUnknownHandler = this.dialogs[this.connectingFromDialogID].childDialogIDs.find(id => {
          return this.dialogs[id].UnknownHandler;
        });
        if (hasUnknownHandler) {
          return false;
        }
      }
      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
// TODO: Cleanup this mess and componentize more
.Dialogue {
  display: inline-flex;
  flex-direction: column;
  user-select: none;
  margin-top: -1px;
  min-width: 400px;
  max-width: 400px;
}
.entry, .inner-values {
  display: flex;
  word-break: break-word;
}
.ai-wrap {
  padding: 10pt 0;
}
hr {
  margin: 10pt 0 0 0;
  border-top: 2px solid $purple;
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
    box-shadow: 2pt 2pt 5pt rgba(0, 0, 0, 0.20);
  }
  h1 {
    color: $purple;
  }
  &.opaque {
    opacity: 1;
    cursor: default;
    background-color: transparent;
    border: 1px solid $purple;
  }
  &.no-border {
    border: 0;
  }
}
.selected {
  border: 1px solid $purple;
  opacity: 1;
  box-shadow: 2pt 2pt 5pt rgba(0, 0, 0, 0.20);
}
.cover-wrap {
  position: absolute;
  top: 0px;
  bottom: -1px;
  left: -1px;
  z-index: 10;
  .toolbox {
    opacity: 0;
  }
  &:hover {
    z-index: 20;
    .cover {
      box-shadow: 2pt 2pt 5pt rgba(0, 0, 0, 0.20);
      transition: box-shadow 0.5s;
      opacity: 1;
      border: 1px solid $purple;
      background-color: var(--color-paper-low-opacity);
      cursor: pointer;
      &.selected {
        cursor: default;
      }
    }
    .toolbox {
      opacity: 1;
    }
  }
}
.toolbox {
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
  padding: 0 10pt;
  z-index: 100;
}
.vspacer {
  height: 20pt;
  border-left: 1px solid $purple;
  margin-top: -1px;
}
.hspacer {
  flex: 1;
}
.actor-vals {
  color: $purple;
  border-left: 1px solid $purple;
}
.actions {
  cursor: default;
  pointer-events: auto;
  display: inline-block;
  padding: 0.25rem;
  background-color: $purple;
  color: white;
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
.entry.any {
  color: $purple;
  font-weight: bold;
}
.editing {
  > .entry {
    left: 0;
    padding: 5pt;
  }
}
.black {
  background-color: black;
}
.dialog-action {
  &.reset-app {
    background-color: maroon;
    color: white;
  }
  &.go-to-zone {
    background-color: goldenrod;
    color: black;
  }
  &.end-conversation {
    background-color: black;
    color: white;
  }
}
textarea {
  width: 100%;
  background-color: transparent;
}
.linethrough {
    text-align: center;
    font-size: 1.5rem;
    margin: 1rem 0;
    position: relative;
    z-index: 1;

    &:before {
        border-top: 2px solid #dfdfdf;
        content:"";
        margin: 0 auto; /* this centers the line to the full width specified */
        position: absolute; /* positioning must be absolute here, and relative positioning must be applied to the parent */
        top: 50%; left: 0; right: 0; bottom: 0;
        width: 95%;
        z-index: -1;
    }

    span {
        /* to hide the lines from behind the text, you have to set the background color the same as the container */
        background: $paper;
        color: $purple;
        padding: 0 15px;
    }
}
</style>
