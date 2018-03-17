<template>
  <div ref="chain" class="tall chain">
    <h1>Conversation Preview</h1>
    <hr>
    <template v-for="(dialogID, idx) of dialogChain">
      <Dialogue
        :key="`chain.${dialogID}.${idx}`"
        :dialog="dialogs[dialogID]"
        :recurse="false"
        :actor="actor"
        :filterChildren="filterChildren"
        :hideTools="hideTools"
        @click="$emit('select-dialog', idx)"
        :parentNode="idx > 0 ? dialogChain[idx-1] : false"
        parentIdHash="chain"
        :isSelected="actorSelectedDialogID == dialogID" />
      <ChildConnector
        v-if="displayChildConnector(idx)"
        width="0px"
        height="50px"
        :key="`chain-child-connector.${dialogID}.${idx}`" />
    </template>
    <Dialogue
      dummy="true"
      :filterChildren="filterChildren"
      v-if="showNewDialog"
      @click.native="$store.dispatch('dialogs/startNewConversation', { parentDialogID: dialogChain && dialogChain.slice(-1).pop() })"
      :parentNode="dialogChain && dialogChain.length ? dialogChain.slice(-1).pop() : false">
      <IconButton name="plus" flat="flat"></IconButton>
      <template v-if="rootDialogs.length">continue conversation</template>
      <template v-else>start first conversation</template>
    </Dialogue>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
import ChildConnector from '@/components/Dialogue/ChildConnector';

export default {
  name: 'DialogChain',
  props: [ 'hideTools', 'filterChildren' ],
  components: {
    ChildConnector
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
      disconnectingFromDialogID: 'disconnectingFromDialogID',
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
    showNewDialog() {
      return !this.newDialog && !this.connectingFromDialogID && !this.hideTools && !this.disconnectingFromDialogID;
    }
  },
  watch: {
    dialogChain(newVal, oldVal) {
      if (newVal.length >= oldVal.length) {
        Vue.nextTick(() => {
          this.$refs.chain.scrollTop = this.$refs.chain.scrollHeight;
        });
      }
    }
  },
  methods: {
    displayChildConnector(idx) {
      if (idx < this.dialogChain.length - 1) return true;
      return this.showNewDialog;
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  color: var(--color-brand);
  &.left {
    text-align: left;
  }
}
.chain {
  overflow-y: scroll;
  width: 332pt;
  margin-right: 20pt;
  -webkit-box-shadow: 0pt 0pt 5pt black;
  box-shadow: 1pt 1pt 2pt rgba(0, 0, 0, 0.2);
  padding: 16pt;
  background-color: white;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 900;
}
</style>
