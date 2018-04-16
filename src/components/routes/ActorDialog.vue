<template>
  <div id="RouteActorDialog" class="absolute-fill">
    <div class="flex absolute-fill">
      <div
        :class="{
          'flex-column': true,
          'disabled': disconnectingFromDialogID,
          tall: true
        }">
        <DialogChain
          @select-dialog="clickChain($event)"
        />
      </div>
      <div class="flex-column padded">
        <h1 class="left">Dialogues with {{ actor.Title }}</h1>
        <h2 v-if="disconnectingFromDialogID" class="left danger">Disconnect dialog</h2>
        <hr>
        <div
          class="dialogs"
          :style="{ 'min-width': `${(dialogSiblings.length + 1) * 400}px` }">
          <Dialogue
            v-for="dialogID of dialogSiblings"
            :key="dialogID"
            :dialog="dialogs[dialogID]"
            :recurse="actorSelectedDialogID == dialogID"
            :isSelected="actorSelectedDialogID == dialogID"
            :tallest="tallest"
            :actor="actor"
            :hideTools="disconnectingFromDialogID"
            @change-height="changeNodeHeight(dialogID, $event)"
            @click="clickDialog($event)"
            :filterDisconnectChildren="filterDisconnectChildren"
            parentIdHash="dialog"
            @click-child="clickDialog($event)" />
          <Dialogue
            dummy="true"
            v-if="showNewDialog && !standardDialogBeingCreated"
            @click="topNewConversation()">
            <IconButton name="plus" flat="flat"></IconButton>{{ !actorSelectedDialogID || !dialogs[actorSelectedDialogID].parentDialogIDs.length ? 'new conversation' : 'continue conversation' }}</Dialogue>
          <Dialogue
            v-if="unknownHandlerDialogID"
            :dialog="dialogs[unknownHandlerDialogID]"
            :recurse="actorSelectedDialogID == unknownHandlerDialogID"
            :isSelected="actorSelectedDialogID == unknownHandlerDialogID"
            :tallest="tallest"
            :actor="actor"
            :hideTools="disconnectingFromDialogID"
            @change-height="changeNodeHeight(unknownHandlerDialogID, $event)"
            @click="clickDialog($event)"
            :filterDisconnectChildren="filterDisconnectChildren"
            parentIdHash="dialog"
            @click-child="clickDialog($event)" />
        <Dialogue
          dummy="true"
          v-if="!unknownHandlerDialogID && showNewDialog"
          @click="topNewConversation({ unknownHandler: true })">
          <IconButton name="plus" flat="flat"></IconButton>anything else</Dialogue>
        </div>
      <div class="action-buttons button-grid">
        <template v-if="disconnectingFromDialogID">
          <w-button
            class="Headline"
            large="large"
            @click="cancelDisconnectDialog()">
            Cancel</w-button>
          <w-button
            v-if="disconnectingToDialogID"
            class="Headline danger"
            large="large"
            @click="confirmDisconnectDialog()">
            Confirm disconnect</w-button>
        </template>
        <template v-else-if="connectingFromDialogID">
          <w-button
            class="Headline"
            large="large"
            @click="cancelConnect()">
            Cancel</w-button>
          <w-button
            v-if="connectingToDialogID"
            class="Headline"
            large="large"
            @click="saveConnect()">
            Save connect</w-button>
        </template>
        <template v-else>
          <w-button
            class="Headline"
            large="large"
            @click="exitBack()">
            <span class="u-arrowWest"></span>Return</w-button>
        </template>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
import DialogChain from '@/components/DialogChain';

export default {
  name: 'ActorDialog',
  components: {
    DialogChain
  },
  data() {
    return {
      tallest: 0,
      heightMap: {}
    };
  },
  computed: {
    ...mapState('dialogs', {
      rootDialogs: 'rootDialogs',
      dialogs: 'dialogMap',
      dialogSiblings(state) {
        if (state.disconnectingFromDialogID) {
          return [ state.disconnectingFromDialogID ];
        }
        return state.dialogSiblings.filter(sibling => !state.dialogMap[sibling].UnknownHandler);
      },
      dialogAllSiblings(state) {
        if (state.disconnectingFromDialogID) {
          return [ state.disconnectingFromDialogID ];
        }
        return state.dialogSiblings;
      },
      actorSelectedDialogID(state) {
        return state.actorSelectedDialogID[this.$route.params.id];
      },
      connectingFromDialogID: 'connectingFromDialogID',
      connectingToDialogID: 'connectingToDialogID',
      disconnectingFromDialogID: 'disconnectingFromDialogID',
      disconnectingToDialogID: 'disconnectingToDialogID',
      newDialog: 'newDialog'
    }),
    ...mapGetters('dialogs', {
      dialogChain: 'currentDialogChain'
    }),
    ...mapState('actors', {
      actor(state) {
        return state.actorMap[this.$route.params.id];
      }
    }),
    ...mapState('zones', {
      lastViewedZone: 'lastViewedZone'
    }),
    showNewDialog() {
      return !this.connectingFromDialogID && !this.disconnectingFromDialogID;
    },
    standardDialogBeingCreated() {
      return this.newDialog && !this.newDialog.UnknownHandler && this.dialogChain[this.dialogChain.length - 1] !== this.newDialog.ID;
    },
    unknownHandlerDialogID() {
      let dialog = this.dialogAllSiblings.find(id => {
        if (!this.dialogs[id]) return false;
        return this.dialogs[id].UnknownHandler;
      });
      return dialog;
    }
  },
  methods: {
    changeNodeHeight(id, value) {
      if (!id) return;
      this.heightMap[id] = value;
      this.tallest = 0;
      for (let k in this.heightMap) {
        if (!this.heightMap[k]) continue;
        this.tallest = Math.max(this.tallest, this.heightMap[k]);
      }
    },
    clickDialog(event) {
      if (event.$event) {
        event.$event.stopPropagation();
      }
      if (this.disconnectingFromDialogID) {
        if (this.disconnectingFromDialogID === event.dialogID) {
          return;
        }
        this.$store.dispatch('dialogs/stageDisconnectDialog', event.dialogID);
        return;
      }

      this.$store.dispatch('dialogs/cancelEditDialog');
      if (this.connectingFromDialogID) {
        this.$store.dispatch('dialogs/selectDialogPreviewConnect', event);
      } else {
        this.$store.dispatch('dialogs/selectDialog', event);
      }
      Vue.nextTick(() => {
        this.tallest = 0;
        for (let k in this.heightMap) {
          if (!this.heightMap[k]) continue;
          if (
            !this.dialogSiblings.find(v => v === k)
          ) {
            this.heightMap[k] = undefined;
            continue;
          }
          this.tallest = Math.max(this.tallest, this.heightMap[k]);
        }
      });
    },
    clickChain(index) {
      this.$store.dispatch('dialogs/cancelEditDialog');
      if (this.connectingFromDialogID) {
        this.$store.dispatch('dialogs/selectChainPreviewConnect', index);
      } else {
        this.$store.dispatch('dialogs/selectChain', index);
      }
      Vue.nextTick(() => {
        this.tallest = 0;
        for (let k in this.heightMap) {
          if (!this.heightMap[k]) continue;
          if (
            !this.dialogSiblings.find(v => v === k)
          ) {
            this.heightMap[k] = undefined;
            continue;
          }
          this.tallest = Math.max(this.tallest, this.heightMap[k]);
        }
      });
    },
    topNewConversation({ unknownHandler = false } = {}) {
      if (!this.showNewDialog) return;
      this.$store.dispatch('dialogs/cancelEditDialog');
      if (this.dialogChain.length <= 1) {
        this.$store.dispatch('dialogs/startNewConversation', { unknownHandler });
      } else {
        this.$store.dispatch(
          'dialogs/startNewConversation',
          { parentDialogID: this.dialogChain.slice(-2, -1).pop(), unknownHandler }
        );
      }
    },
    cancelDisconnectDialog() {
      this.$store.dispatch('dialogs/cancelDisconnectDialog');
    },
    confirmDisconnectDialog() {
      this.$store.dispatch('dialogs/confirmDisconnectDialog');
    },
    saveConnect() {
      this.$store.dispatch('dialogs/saveConnectDialog');
    },
    cancelConnect() {
      this.$store.dispatch('dialogs/cancelConnectDialog');
    },
    filterDisconnectChildren(id) {
      let dialog = this.dialogs[id];
      if (!dialog) return false;
      return dialog.parentDialogIDs.length > 1;
    },
    exitBack() {
      if (this.lastViewedZone) {
        this.$router.push({ name: 'ZoneHome', params: { id: this.lastViewedZone } });
      } else {
        this.$router.push({ name: 'ProjectHome' });
      }
    }
  }
};
</script>

<style scoped lang="scss">
h1 {
  text-align: center;
  color: var(--color-brand);
  &.left {
    text-align: left;
  }
}
.dialogs {
  width: 100%;
  display: flex;
}
hr {
  color: var(--color-brand);
  opacity: 0.8;
}
.space {
  height: 50pt;
}
.action-buttons {
  padding-top: 100pt;
}
.disabled {
  filter: grayscale(100%) contrast(15%) brightness(150%);
  pointer-events: none;
  * {
    box-shadow: none;
  }
}
.padded {
  padding: 1rem;
  margin-left: 343pt;
}
</style>
