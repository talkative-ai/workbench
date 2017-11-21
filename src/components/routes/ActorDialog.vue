<template>
  <div id="RouteActorDialog">
    <div class="flex">
      <div class="flex-column">
        <DialogChain
          @select-dialog="clickChain($event)"
        />
        <w-button
          class="Headline"
          large="large"
          @click.native="$router.push({ name: 'ActorHome', params: { zoneid: $route.params.id } })">
          <span class="u-arrowWest"></span>Return</w-button>
        <div class="space"></div>
      </div>
      <div class="flex-column">
        <h1 class="left">Dialogues with {{ actor.Title }}</h1>
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
            @change-height="changeNodeHeight(dialogID, $event)"
            @click="clickDialog($event)"
            @click-child="clickDialog($event)" />
          <Dialogue
            dummy="true"
            v-if="!newDialog && !connectingFromDialogID"
            @click.native="topNewConversation()">
            <IconButton name="plus" flat="flat"></IconButton>{{ dialogChain.length == 1 ? 'new conversation' : 'continue conversation' }}</Dialogue>
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
      dialogSiblings: 'dialogSiblings',
      actorSelectedDialogID(state) {
        return state.actorSelectedDialogID[this.$route.params.id];
      },
      connectingFromDialogID: 'connectingFromDialogID',
      newDialog: 'newDialog'
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
      if (this.dialogChain.length <= 1) {
        this.$store.dispatch('dialogs/startNewConversation');
      } else {
        this.$store.dispatch(
          'dialogs/startNewConversation',
          this.dialogChain
            .slice(-2, -1)
            .pop()
        );
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
