<template>
  <label class="toggle">
    <label class="switch">
      <input type="checkbox" :checked="value" @change="updatedValue($event.target.checked)">
      <span class="slider round"></span>
    </label>
    <p><slot /></p>
  </label>
</template>

<script scoped>
export default {
  name: 'toggle',
  props: ['value'],
  methods: {
    updatedValue(nextVal) {
      this.$emit('input', nextVal);
    }
  }
};
</script>

<style lang="scss" scoped>
.toggle {
  display: inline-flex;
  align-items: center;
}
p {
  margin-left: 10pt;
  font-size: 1rem;
}
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  display:none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: $purple;
}

input:focus + .slider {
  box-shadow: 0 0 1px $purple;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
