<template>
  <div id="RouteActorDialog">
    <h1 v-if="$route.params.linking_child">Select a dialog to link to</h1>
    <div class="flex">
      <div class="flex-column">
        <div class="chain">
          <h1>Conversation</h1>
          <hr>
          <DialogNode
            v-for="(dialogID, idx) of dialogChain"
            :key="dialogID"
            :dialog="dialogs[dialogID]"
            :recurse="false"
            @click="clickChain(idx)"
            :isChildIteration="idx > 0"
            :isSelected="actorSelectedDialogID == dialogID" />
          <DummyNode
            v-if="!newDialog && !connectingFromDialogID"
            @click.native="$store.dispatch('dialogs/startNewConversation', dialogChain.slice(-1).pop())"
            isChildIteration="true">
            <IconButton name="plus" flat="flat"></IconButton>
            <template v-if="rootDialogs.length">new</template>
            <template v-else>start first conversation</template>
          </DummyNode>
          <div v-if="connectingFromDialogID">
            <hr>
            <div class="button-grid">
              <w-button @click.native="saveConnect">Connect</w-button>
              <w-button @click.native="saveConnect">Cancel</w-button>
            </div>
          </div>
        </div>
        <w-button
          class="Headline"
          large="large"
          @click.native="$router.push({ name: 'ActorHome', params: { zoneid: $route.params.id } })">
          <span class="u-arrowWest"></span>Return</w-button>
        <div class="space"></div>
      </div>
      <div
        class="dialogs"
        v-if="dialogSiblings.length"
        :style="{ 'min-width': `${(dialogSiblings.length + 1) * 400}px` }">
        <DialogNode
          v-for="dialogID of dialogSiblings"
          :key="dialogID"
          :dialog="dialogs[dialogID]"
          :recurse="actorSelectedDialogID == dialogID"
          :isSelected="actorSelectedDialogID == dialogID"
          :tallest="tallest"
          @change-height="changeNodeHeight(dialogID, $event)"
          @click="clickDialog($event)"
          @click-child="clickDialog($event)" />
        <DummyNode
          v-if="!newDialog && !connectingFromDialogID"
          @click.native="topNewConversation()">
          <IconButton name="plus" flat="flat"></IconButton>new</DummyNode>
      </div>
    </div>
  </div>
</template>

<script>
import DummyNode from '../DummyNode';
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'ActorDialog',
  components: {
    DummyNode
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
      dialogSiblings: 'dialogSiblings',
      actorSelectedDialogID(state) {
        return state.actorSelectedDialogID[this.$route.params.id];
      },
      connectingFromDialogID: 'connectingFromDialogID',
      newDialog: 'newDialog'
    }),
    ...mapGetters('dialogs', {
      dialogChain: 'currentDialogChain'
    })
  },
  methods: {
    changeNodeHeight(id, value) {
      this.heightMap[id] = value;
      this.tallest = 0;
      for (let k in this.heightMap) {
        if (!this.heightMap[k]) continue;
        this.tallest = Math.max(this.tallest, this.heightMap[k]);
      }
    },
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
            !this.dialogSiblings.find(v => Number(v) === Number(k))
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
            !this.dialogSiblings.find(v => Number(v) === Number(k))
          ) {
            this.heightMap[k] = undefined;
            continue;
          }
          this.tallest = Math.max(this.tallest, this.heightMap[k]);
        }
      });
    },
    topNewConversation() {
      if (
        this.dialogChain
          .length <= 1
      ) {
        this.$store.dispatch('dialogs/startNewConversation');
      } else {
        this.$store.dispatch(
          'dialogs/startNewConversation',
          this.dialogChain
            .slice(-2, -1)
            .pop()
        );
      }
    },
    saveConnect() {
      this.$store.dispatch('dialogs/saveConnectDialog');
    }
  }
};
</script>

<style scoped lang="scss">
h1 {
  text-align: center;
  color: var(--color-brand);
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
</style>
