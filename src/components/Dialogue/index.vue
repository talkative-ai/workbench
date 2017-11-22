<template>

  <div v-if="dummy" class="Dialogue">
    <div class="wrap" style="height: 100px;" ref="dialog">
      <div class="vspacer" v-if="parentNode"></div>
      <div class="ball" v-if="parentNode"></div>
      <div class="cover-wrap">
        <div class="cover opaque no-border">
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
          <div class="cover" v-else-if="connectingFromDialogID && !dialogs[connectingFromDialogID].ChildDialogIDs.includes(dialog.ID)"
            @click="$emit('click', { dialogID: dialog.ID })">
            <h1 v-if="!isSelected">
              <IconButton name="link"></IconButton>preview connect</h1>
          </div>
          <div
            class="cover"
            v-else
            @click="$emit('click', { dialogID: dialog.ID })"
            :class="{
              selected: isSelected
            }">
            <h1 v-if="!isSelected">
              <IconButton name="search"></IconButton>&nbsp;select</h1>
          </div>
          <template v-if="connectingFromDialogID"></template>
          <template v-else>
            <div
              v-if="!hideTools"
              class="toolbox" :class="{
                  'with-error': dialogEditError
                }">
              <div class="button-grid-small">
                <IconButton name="pencil" label="edit" @click.native="beginEdit()"></IconButton>
                <IconButton name="link" label="connect" @click.native="beginConnect()"></IconButton>
                <div class="hspacer" />
                <IconButton name="trash" label="delete" @click.native="stageDeleteDialog()"></IconButton>
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
            <div class="actions" v-if="childDialogIDs && childDialogIDs.length">await response</div>
            <div class="actions dialog-action" v-else :class="{ [dialogAction]: true }">{{ dialogActionFriendly }}</div>
          </div>
        </template>
        <template v-else>
          <h3>The user can say one of the following:</h3>
          <div
            class="entry"
            v-for="(entry, index) in dialogEditingCopy.EntryInput"
            :key="index"
            :class="{ 'child': parentNode }">
            <input v-model="dialogEditingCopy.EntryInput[index]" />
            <IconButton v-if="dialogEditingCopy.EntryInput.length > 1" name="times" flat="flat" @click.native="dialogEditingCopy.EntryInput.splice(index, 1)"></IconButton>
            <span v-if="index < dialogEditingCopy.EntryInput.length-1"></span>
          </div>
          <IconButton label="User can say" name="plus" @click.native="addEntryInput()"></IconButton>
          <div class="ai-wrap">
            <h3>{{ actor.Title }} replies with all of the following:</h3>
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
                  <IconButton name="plus" :label="`${actor.Title} says`" @click.native="addPlaySound()"></IconButton>
                </div>
              </div>
              <div class="actions" v-if="childDialogIDs && childDialogIDs.length">await response</div>
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
          <div
            v-if="!hideTools"
            class="toolbox"
            :class="{
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
      <ChildConnector
        v-if="childDialogIDs && childDialogIDs.length"
        :width="`${calculateChildrenWidth()}px`"
        :height="`${tallest - height + 50}px`" />
      <div class="child-dialogs" v-if="childDialogIDs && childDialogIDs.length">
        <div v-for="(dialogID, idx) of childDialogIDs" :key="dialogID">
          <Dialogue
            :actor="actor"
            :dialog="dialogs[dialogID]"
            :parentNode="dialog.ID"
            :recurse="false"
            :filterChildren="filterChildren"
            @click="$emit('click-child', { dialogID, isChild: true })"
            @click-child="$emit('click-child', { dialogID, isChild: true })"></Dialogue>
        </div>
        <Dialogue
          dummy="true"
          v-if="!newDialog && !connectingFromDialogID && !hideTools"
          @click.native="$store.dispatch('dialogs/startNewConversation', dialogChain.slice(-1).pop())"
          :parentNode="dialog.ID">
          <IconButton name="plus" flat="flat"></IconButton>continue conversation</Dialogue>
      </div>
      <Dialogue
        dummy="true"
        v-else-if="!newDialog && !connectingFromDialogID && !hideTools"
        @click.native="$store.dispatch('dialogs/startNewConversation', dialogChain.slice(-1).pop())"
        :parentNode="dialog.ID">
        <IconButton name="plus" flat="flat"></IconButton>continue conversation</Dialogue>
    </template>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapState } from 'vuex';
import ChildConnector from './ChildConnector';

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
    'hideTools'
  ],
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
      },
      childDialogIDs(state) {
        if (!this.filterChildren) {
          return this.dialog.ChildDialogIDs;
        }
        return this.dialog.ChildDialogIDs.filter(this.filterChildren);
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
      if (!this.childDialogIDs) return 1;
      let newDialogOffset = this.newDialog || this.connectingFromDialogID ? 1 : 0;
      return ((this.childDialogIDs.length - newDialogOffset) * 400);
    },
    beginEdit() {
      this.$store.dispatch('dialogs/editDialog', this.dialog.ID);
    },
    stageDeleteDialog() {
      this.$store.dispatch('dialogs/stageDeletion', this.dialog.ID);
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
}
.ai-wrap {
  margin: 10pt 0;
  padding: 10pt 0;
  border-top: 1px solid $purple;
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
.black {
  background-color: black;
}
.dialog-action {
  &.go-to-zone {
    background-color: green;
    color: white;
  }
  &.end-conversation {
    background-color: black;
    color: white;
  }
}
</style>
