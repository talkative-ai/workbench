<template>
  <div id="RouteZoneCreate">
    <Sidebar />
    <div class="main-container">
      <h1>Everything happens in a Zone.</h1>
      <h2>Name this Zone:</h2>
      <div class="flex">
        <input v-model="zoneName" />
        <router-link :class="'button no-outline ' + ((!zoneName.length && 'hidden') || '')" to="/zone/1">
          Enter
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../Sidebar.vue'
export default {
  name: 'ZoneCreate',
  components: {
    Sidebar
  },
  data () {
    return {
      zoneName: ''
    }
  }
}
</script>

<style lang="scss" scoped>
#RouteZoneCreate, input {
  color: white;
}

#RouteZoneCreate {
  display: flex;
}

h1 {
  color: $lighter-grey;
}

h1, h2 {
  font-weight: 100;
  margin: 0;
  font-size: 2rem;
}

.main-container {
  padding: 5%;
  width: 100%;
}

</style>
