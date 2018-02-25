<template>
  <div class="main">
    <div ref="dialogs" class="dialogs-wrap">
      <template v-for="dialog of $store.state.demo.dialogs">
        <div v-if="dialog.type == 'user'" class="user-dialog dialog" :key="dialog.key">
          <div>You</div>
          {{ dialog.text }}
        </div>
        <div v-else class="ai-dialog dialog" :key="dialog.key">
          <div>AI</div>
          {{ dialog.text }}
        </div>
      </template>
    </div>
    <div class="input-box">
      <input @keyup.enter="sendMessage()" v-model="message" placeholder="Enter your message here" type="text" />
      <div class="space" />
      <div class="buttons">
        <IconButton
          v-if="$store.state.demo.dialogs.length > 1"
          @click="restartDemo()"
          label="restart"
          name="refresh"
          :flat="true"
          :shrinky="true"/>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ConvoBox',
    data() {
      return {
        message: ''
      };
    },
    methods: {
      sendMessage() {
        this.$store.dispatch('demo/sendMessage', this.message);
        this.message = '';
      },
      restartDemo() {
        this.$store.dispatch('demo/restart');
      }
    },
    watch: {
      '$store.state.demo.dialogs'() {
        this.$nextTick(() => {
          this.$refs.dialogs.scrollTop = this.$refs.dialogs.scrollHeight;
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
.dialog {
  background-color: white;
  margin: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  box-shadow: 1px 1px 5px rgba(0,0,0,0.4);
  border-radius: 0.5rem;
  color: black;
  > div {
    font-weight: bold;
    border-bottom: 1px dashed rgba(0,0,0,0.4);
    margin-bottom: 8px;
    margin-bottom: 0.5rem;
    padding-bottom: 0.3rem;
  }
}
.dialogs-wrap {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  max-height: 40vh;
  overflow: scroll;
}
.ai-dialog {
  align-self: flex-start;
}
.user-dialog {
  text-align: right;
  align-self: flex-end;
}
.main {
  background-color: $purple;
  flex: 1;
  margin: 1rem;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
}
.space {
  flex: 1;
}
.input-box {
  display: flex;
  align-items: center;
  background-color: white;
  font-size: 1rem;
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0 0 0.5rem 0.5rem;
  box-shadow: 0px -7px 10px -3px rgba(0,0,0,0.3);
  z-index: 100;
  .buttons {
    padding: 0 1rem;
  }
}
input {
  outline: none;
  border: none;
  padding: 1.5rem;
  width: 100%;
  border-radius: 0 0 0.5rem 0.5rem;
}
</style>
