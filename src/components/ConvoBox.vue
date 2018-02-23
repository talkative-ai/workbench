<template>
  <div class="main">
    <div class="dialogs-wrap">
      <div class="ai-dialog dialog">
        <div>AI</div>
        Hello. Ask me how I'm doing.
      </div>
      <div class="user-dialog dialog">
        <div>You</div>
        How are you?
      </div>
      <div class="ai-dialog dialog">
        <div>AI</div>
        Hello. Ask me how I'm doing.
      </div>
      <div class="user-dialog dialog">
        <div>You</div>
        How are you?
      </div>
      <div class="ai-dialog dialog">
        <div>AI</div>
        Hello. Ask me how I'm doing.
      </div>
      <div class="user-dialog dialog">
        <div>You</div>
        How are you?
      </div>
    </div>
    <input placeholder="Enter your message here" type="text" />
  </div>
</template>
<script>
  export default {
    name: 'ConvoBox',
    data() {
      return {};
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
input {
  font-size: 1rem;
  padding: 1.5rem;
  border-top: none;
  border-left: none;
  border-right: none;
  outline: none;
  border-radius: 0 0 0.5rem 0.5rem;
  box-shadow: 0px -7px 10px -3px rgba(0,0,0,0.3);
  z-index: 100;
}
</style>
