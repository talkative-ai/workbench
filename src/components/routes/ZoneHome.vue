<template>
  <div id="RouteZoneHome">
    <Sidebar />
    <div class="zone-body-wrap">
      Zone home
    </div>
  </div>
</template>

<script>
import Sidebar from '../Sidebar'

export default {
  name: 'ZoneHome',
  components: {
    Sidebar
  }
}
</script>

<style lang="scss">
#RouteZoneHome {
  display: flex;

  .zone-body-wrap {
    width: 75%;
    background-color: white;
    box-shadow: 0pt 3pt 20pt rgba(0,0,0,0.2);
  }
}
</style>
