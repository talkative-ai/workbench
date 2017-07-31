<template>
  <div id="RouteZoneHome">
    <Sidebar />
    <div class="zone-body-wrap">
      <div class="text">
        <h1>You're in the zone.</h1>
        <h1>What do you want to happen?</h1>
      </div>
      <span class="buttons-box">
        <span>
          <h1>Actors say and do what you wish!</h1>
          <div>
            Add an Actor
          </div>
        </span>
        <span>
          <h1>Triggers define how the zone works!</h1>
          <div>
            Add a Trigger
          </div>
        </span>
      </span>
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
    align-self: baseline;
    min-height: 20vh;
    width: 75%;
    background-color: white;
    box-shadow: 0pt 3pt 20pt rgba(0,0,0,0.2);

    .buttons-box {
      display: flex;
      span {
        flex: 1;
        margin: 0.5rem;
        &:first-child {
          margin-left: 1rem;
        }
        &:last-child {
          margin-right: 1rem;
        }
        div {
          height: 40vh;
          background-color: beige;
        }
      }
    }
    h1 {
      font-weight: 100;
      margin: 0;
      color: $lighter-grey;
    }

    .text {
      margin: 2.5rem 4rem;
    }
  }
}
</style>
