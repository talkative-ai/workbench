<template lang="pug">
  #RouteActorDialog
    h1(v-if="$route.params.linking_child") Select a dialog to link to
    .flex
      .flex-column
        .chain
          h1 Conversation
          hr
          DialogNode(
            v-for='(dialogID, idx) of dialogChain'
            :key='dialogID'
            :dialog='dialogs[dialogID]'
            :recurse='false'
            @click="clickChain(idx)"
            :isChildIteration='idx > 0'
            :isSelected='isSelected(dialogID)'
          )
          DummyNode(
            v-if="!$store.state.newDialog"
            @click.native="$store.dispatch('startNewConversation', dialogChain.slice(-1).pop())"
            isChildIteration="true"
            )
            IconButton(name="plus" flat)
            template(v-if="$store.state.rootDialogs.length")
              | new
            template(v-else)
              | start first conversation
        w-button.Headline(
          large
          @click.native="$router.push({ name: 'ActorHome', params: { zoneid: $route.params.id } })")
          span.u-arrowWest
          | Return
        .space
      .dialogs(
        v-if="$store.state.dialogSiblings.length"
        :style="{ 'min-width': `${(($store.state.dialogSiblings.length + 1) * 400)}px` }")
        DialogNode(
          v-for='dialogID of $store.state.dialogSiblings'
          :key='dialogID'
          :dialog='dialogs[dialogID]'
          :recurse='isSelected(dialogID)'
          :isSelected='isSelected(dialogID)'
          :tallest='tallest'
          @change-height='changeNodeHeight(dialogID, $event)'
          @click="clickDialog({ dialogID })"
          @click-child="clickDialog($event)"
        )
        DummyNode(
          v-if="!$store.state.newDialog && !$store.state.connectingDialogID"
          @click.native="topNewConversation()")
          IconButton(name="plus" flat)
          | new
</template>

<script>
import DummyNode from '../DummyNode';
import Vue from 'vue';

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
    rootDialogs() {
      return this.$store.state.rootDialogs || [];
    },
    dialogs() {
      return this.$store.state.dialogMap || {};
    },
    dialogChain() {
      return this.$store.state.dialogChain[this.$store.state.selectedEntity.data.ID] || [];
    }
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
    isSelected(dialogID = 0) {
      return (this.$store.state.actorSelectedDialogID[this.$route.params.id] || '') === dialogID;
    },
    clickDialog(event, e) {
      this.$store.dispatch('cancelEditDialog');
      this.$store.dispatch('selectDialog', event);
      Vue.nextTick(() => {
        this.tallest = 0;
        for (let k in this.heightMap) {
          if (!this.heightMap[k]) continue;
          if (!this.$store.state.dialogSiblings.find(v => Number(v) === Number(k))) {
            this.heightMap[k] = undefined;
            continue;
          }
          this.tallest = Math.max(this.tallest, this.heightMap[k]);
        }
      });
    },
    clickChain(index) {
      this.$store.dispatch('cancelEditDialog');
      this.$store.dispatch('selectChain', index);
      Vue.nextTick(() => {
        this.tallest = 0;
        for (let k in this.heightMap) {
          if (!this.heightMap[k]) continue;
          if (!this.$store.state.dialogSiblings.find(v => Number(v) === Number(k))) {
            this.heightMap[k] = undefined;
            continue;
          }
          this.tallest = Math.max(this.tallest, this.heightMap[k]);
        }
      });
    },
    topNewConversation() {
      if (this.$store.state.dialogChain[this.$store.state.selectedEntity.data.ID].length <= 1) {
        this.$store.dispatch('startNewConversation');
      } else {
        this.$store.dispatch('startNewConversation', this.$store.state.dialogChain[this.$store.state.selectedEntity.data.ID].slice(-2, -1).pop());
      }
    }
  }
};
</script>

<style scoped lang="scss">
h1 {
  text-align: center;
  color: var(--color-brand);
}
.flex {
  display: flex;
  align-items: flex-start;
}
.flex-column {
  flex-direction: column;
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
