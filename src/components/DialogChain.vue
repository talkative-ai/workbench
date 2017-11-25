<template>
  <div class="chain">
    <h1>Preview Conversation</h1>
    <hr>
    <template v-for="(dialogID, idx) of dialogChain">
      <Dialogue
        :key="dialogID"
        :dialog="dialogs[dialogID]"
        :recurse="false"
        :actor="actor"
        :filterChildren="filterChildren"
        :hideTools="hideTools"
        @click="$emit('select-dialog', idx)"
        :parentNode="idx > 0 ? dialogChain[idx-1] : false"
        :isSelected="actorSelectedDialogID == dialogID" />
      <ChildConnector
        v-if="displayChildConnector(idx)"
        width="0px"
        height="50px"
        :key="dialogID" />
    </template>
    <Dialogue
      dummy="true"
      :filterChildren="filterChildren"
      v-if="showNewDialog"
      @click.native="$store.dispatch('dialogs/startNewConversation', dialogChain && dialogChain.slice(-1).pop())"
      :parentNode="dialogChain && dialogChain.length ? dialogChain.slice(-1).pop() : false">
      <IconButton name="plus" flat="flat"></IconButton>
      <template v-if="rootDialogs.length">continue conversation</template>
      <template v-else>start first conversation</template>
    </Dialogue>
  </div>
</template>

<script>
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
  text-align: center;
  color: var(--color-brand);
  &.left {
    text-align: left;
  }
}
</style>
