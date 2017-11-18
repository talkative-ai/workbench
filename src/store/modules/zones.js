import Vue from 'vue';
import dcopy from 'deep-copy';

import router from '@/router';
import API from '@/api';
import { PATCH_ACTION, TRIGGER_TYPES } from '@/const';
import { defaultZone, defaultActionSet } from '@/store/models';

const state = {
  zoneMap: {},
  zoneActors: {}
};

const actions = {
  async createZone({ commit, state, dispatch }, zone) {
    zone.CreateID = await dispatch('generateID');
    return API.CreateZone(zone)
    .then(idMap => {
      let newZone = dcopy(defaultZone);
      newZone.ID = idMap[zone.CreateID];
      newZone.Title = zone.Title;

      commit('addZone', newZone);
      commit('selectEntity', { kind: 'zone', data: newZone, redirect: true });
      return newZone;
    });
  },

  createIntroMessage({ state }, ZoneID) {
    let zone = state.zoneMap[ZoneID];
    if (!zone.Triggers[TRIGGER_TYPES.InitializeZone]) {
      Vue.set(zone.Triggers, TRIGGER_TYPES.InitializeZone, {
        'AlwaysExec': dcopy(defaultActionSet)
      });
    }
    Vue.set(zone.Triggers[TRIGGER_TYPES.InitializeZone], 'PatchAction', PATCH_ACTION.CREATE);
  },

  saveIntroMessage({ state }, { ZoneID, message }) {
    let zone = state.zoneMap[ZoneID];
    Vue.set(zone.Triggers[TRIGGER_TYPES.InitializeZone].AlwaysExec.PlaySounds[0], 'Val', message);
    API.PatchProject({
      Zones: [{
        ID: zone.ID,
        Triggers: zone.Triggers
      }]
    });
  },

  removeIntroMessage({ state }, ZoneID) {
    let zone = state.zoneMap[ZoneID];
    if (!zone.Triggers[TRIGGER_TYPES.InitializeZone] ||
      zone.Triggers[TRIGGER_TYPES.InitializeZone].PATCH_ACTION === PATCH_ACTION.CREATE) return;
    Vue.set(zone.Triggers[TRIGGER_TYPES.InitializeZone], 'PatchAction', PATCH_ACTION.DELETE);
    API.PatchProject({
      Zones: [{
        ID: zone.ID,
        Triggers: {
          [TRIGGER_TYPES.InitializeZone]: {
            PatchAction: PATCH_ACTION.DELETE
          }
        }
      }]
    });
  },

  removeActorFromZone({ state }, { ActorID, ZoneID }) {
    Vue.set(state.zoneActors[ZoneID], ActorID, false);
    if (!state.actorMap[ActorID].zoneIDs) {
      Vue.set(state.actorMap[ActorID], 'zoneIDs', []);
    }
    for (let id in state.actorMap[ActorID].zoneIDs) {
      if (state.actorMap[ActorID].zoneIDs[id].toString() === ZoneID.toString()) {
        state.actorMap[ActorID].zoneIDs.splice(id, 1);
        break;
      }
    }
    API.PatchProject({
      ZoneActors: [{
        ZoneID: Number(ZoneID),
        ActorID: Number(ActorID),
        PatchAction: PATCH_ACTION.DELETE
      }]
    });
  },

  addActorToZone({ state }, { ActorID, ZoneID }) {
    Vue.set(state.zoneActors[ZoneID], ActorID, true);
    if (!state.actorMap[ActorID].zoneIDs) {
      Vue.set(state.actorMap[ActorID], 'zoneIDs', []);
    }
    state.actorMap[ActorID].zoneIDs.push(ZoneID);
    API.PatchProject({
      ZoneActors: [{
        ZoneID: Number(ZoneID),
        ActorID: Number(ActorID),
        PatchAction: PATCH_ACTION.CREATE
      }]
    });
  },

  selectZone({ commit, state }, zoneID) {
    if (state.selectedEntity.data && state.selectedEntity.data.ID === zoneID) return;
    const zone = state.zoneMap[zoneID];
    if (!zone) {
      router.push({ name: 'NotFound' });
      return;
    }
    return API.GetZone(zone)
    .then(zone => {
      commit('updateZone', zone);
      commit('selectEntity', { kind: 'zone', data: zone });
    });
  }
};

const mutations = {
  addZone(state, zone) {
    state.selectedProject.Zones.push(zone);
    Vue.set(state.zoneMap, zone.ID, zone);
    Vue.set(state.zoneActors, zone.ID, {});
  },

  updateZone(state, zone) {
    Vue.set(state.zoneMap, zone.ID, zone);
    if (!state.zoneActors[zone.ID]) {
      Vue.set(state.zoneActors, zone.ID, {});
    }
  }
};

export default {
  state,
  actions,
  mutations
};
