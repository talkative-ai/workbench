<template>
  <div id="RouteActorDialog">
    <div class="flex">
      <div class="flex-column">
        <DialogChain
          @select-dialog="clickChain($event)"
          hideTools="true"
          :filterChildren="filterChildren"
        />
        <div class="space"></div>
      </div>
      <div class="flex-column padded">
        <h1 class="left danger"><fa-icon name="exclamation-triangle"></fa-icon> Confirm Delete</h1>
        <h2 class="danger">
        All of these dialogs and conversations will be deleted. This action cannot be undone</h2>
        <hr>
        <div
          class="dialogs"
          v-if="dialogSiblings.length"
          :style="{ 'min-width': `${(dialogSiblings.length + 1) * 400}px` }">
          <Dialogue
            v-for="dialogID of dialogSiblings"
            :key="dialogID"
            :dialog="dialogs[dialogID]"
            :recurse="actorSelectedDialogID == dialogID"
            :isSelected="actorSelectedDialogID == dialogID"
            :tallest="tallest"
            :actor="actor"
            :filterChildren="filterChildren"
            hideTools="true"
            hideSpecialDialogs="true"
            @click="clickDialog($event)"
            @click-child="clickDialog($event)" />
        </div>
        <div class="action-buttons button-grid">
          <w-button
            class="Headline"
            large="large"
            @click="cancelDelete()">
            Cancel</w-button>
          <w-button
            class="Headline danger"
            large="large"
            @click="confirmDeleteDialog()">
            Confirm Delete</w-button>
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
  name: 'DialogDeletion',
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
      deletionCandidates: 'deletionCandidates',
      dialogSiblings(state) {
        let result = [];
        for (let sibling of state.dialogSiblings) {
          if (this.deletionCandidates[sibling]) {
            result.push(sibling);
          }
        }
        return result;
      },
      actorSelectedDialogID(state) {
        return state.actorSelectedDialogID[this.$route.params.id];
      }
    }),
    ...mapGetters('dialogs', {
      dialogChain: 'currentDialogChain'
    }),
    ...mapState('actors', {
      actor(state) {
        return state.actorMap[this.$route.params.id];
      }
    })
  },
  methods: {
    clickDialog(event) {
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
    filterChildren(id) {
      return this.deletionCandidates[id];
    },
    cancelDelete() {
      this.$store.dispatch('dialogs/cancelDeletion');
      this.$store.dispatch('dialogs/selectDialog', { dialogID: this.dialogChain.slice(-1).pop() });
      this.$router.push({ name: 'ActorDialog', params: this.$route.params });
    },
    confirmDeleteDialog() {
      this.$store.dispatch('dialogs/confirmDeletion').then(() => {
        this.$router.push({ name: 'ActorDialog', params: this.$route.params });
      });
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
.chain {
  width: 332pt;
  margin-right: 20pt;
  -webkit-box-shadow: 0pt 0pt 5pt black;
  box-shadow: 1pt 1pt 2pt rgba(0, 0, 0, 0.2);
  padding: 16pt;
  background-color: white;
  margin-bottom: 30pt;
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

.padded {
  padding: 1rem;
  margin-left: 342pt;
}
</style>
