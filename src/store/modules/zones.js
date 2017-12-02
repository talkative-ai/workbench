import dcopy from 'deep-copy';
import Vue from 'vue';

import router from '@/router';
import API from '@/api';
import { PATCH_ACTION, TRIGGER_TYPES } from '@/const';
import { defaultZone, defaultActionSet } from '@/store/models';

const state = {
  zoneMap: {},
  zoneActors: {},
  lastViewedZone: null
};

const actions = {
  async createZone({ commit, state, dispatch, rootState }, zone) {
    zone.CreateID = await dispatch('master/generateID', {}, { root: true });
    return API.CreateZone(zone)
    .then(idMap => {
      let newZone = dcopy(defaultZone);
      newZone.ID = idMap[zone.CreateID];
      newZone.Title = zone.Title;

      commit('addZone', newZone);
      commit('project/addZone', newZone, { root: true });
      dispatch('master/selectEntity', { kind: 'zone', data: newZone, navigate: true }, { root: true });
      return newZone;
    })
    .then(newZone => {
      if (rootState.project.selectedProject.Zones.length === 1) {
        dispatch('project/startZone', newZone.ID, { root: true });
      }
      return newZone;
    });
  },

  createIntroMessage({ state, commit }, ZoneID) {
    commit('stageCreateZoneIntroTrigger', ZoneID);
  },

  saveIntroMessage({ state, commit }, { ZoneID, message }) {
    let zone = state.zoneMap[ZoneID];
    if (state.zoneMap[ZoneID].Triggers[TRIGGER_TYPES.InitializeZone].PatchAction == null) {
      commit('stageUpdateIntroMessage', { ZoneID });
    }
    commit('introMessage', { ZoneID, message });
    API.PatchProject({
      Zones: [{
        ID: zone.ID,
        Triggers: zone.Triggers
      }]
    }).then(() => {
      Vue.delete(state.zoneMap[ZoneID].Triggers[TRIGGER_TYPES.InitializeZone], 'PatchAction');
    });
  },

  removeIntroMessage({ state, commit }, ZoneID) {
    let zone = state.zoneMap[ZoneID];
    if (!zone.Triggers[TRIGGER_TYPES.InitializeZone] ||
      zone.Triggers[TRIGGER_TYPES.InitializeZone].PATCH_ACTION === PATCH_ACTION.CREATE) return;
    commit('stageDeleteZoneIntroTrigger', { ZoneID });
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

  removeActorFromZone({ state, commit }, { ActorID, ZoneID }) {
    commit('removeActor', { ZoneID, ActorID });
    commit('actors/removeFromZone', { ActorID, ZoneID }, { root: true });
    API.PatchProject({
      ZoneActors: [{
        ZoneID: ZoneID,
        ActorID: ActorID,
        PatchAction: PATCH_ACTION.DELETE
      }]
    });
  },

  addActorToZone({ state, commit }, { ActorID, ZoneID }) {
    commit('addActor', { ZoneID, ActorID });
    commit('actors/addToZone', { ActorID, ZoneID }, { root: true });
    API.PatchProject({
      ZoneActors: [{
        ZoneID: ZoneID,
        ActorID: ActorID,
        PatchAction: PATCH_ACTION.CREATE
      }]
    });
  },

  selectZone({ commit, dispatch, state, rootState }, zoneID) {
    if (rootState.master.selectedEntity.data && rootState.master.selectedEntity.data.ID === zoneID) return;
    const zone = state.zoneMap[zoneID];
    if (!zone) {
      router.push({ name: 'NotFound' });
      return;
    }
    return API.GetZone(zone)
    .then(zone => {
      commit('updateZone', zone);
      commit('lastViewedZone', zone.ID);
      dispatch('master/selectEntity', { kind: 'zone', data: zone }, { root: true });
    });
  },

  lastViewedZone({ commit }, id) {
    commit('lastViewedZone', id);
  }
};

const mutations = {
  addZone(state, zone) {
    Vue.set(state.zoneMap, zone.ID, zone);
    Vue.set(state.zoneActors, zone.ID, zone);
  },

  updateZone(state, zone) {
    Vue.set(state.zoneMap, zone.ID, zone);
    if (!state.zoneActors[zone.ID]) {
      Vue.set(state.zoneActors, zone.ID, {});
    }
  },

  zoneInMap(state, zone) {
    Vue.set(state.zoneMap, zone.ID, zone);
  },

  zoneActors(state, { id, value }) {
    Vue.set(state.zoneActors, id, value);
  },

  addActor(state, { ZoneID, ActorID }) {
    if (!state.zoneActors[ZoneID]) {
      Vue.set(state.zoneActors, ZoneID, {});
    }
    Vue.set(state.zoneActors[ZoneID], ActorID, true);
  },

  removeActor(state, { ZoneID, ActorID }) {
    if (!state.zoneActors[ZoneID]) {
      Vue.set(state.zoneActors, ZoneID, {});
    }
    Vue.set(state.zoneActors[ZoneID], ActorID, false);
  },

  stageCreateZoneIntroTrigger(state, ZoneID) {
    if (!state.zoneMap[ZoneID].Triggers[TRIGGER_TYPES.InitializeZone]) {
      Vue.set(state.zoneMap[ZoneID].Triggers, TRIGGER_TYPES.InitializeZone, {
        'AlwaysExec': dcopy(defaultActionSet)
      });
    }
    Vue.set(state.zoneMap[ZoneID].Triggers[TRIGGER_TYPES.InitializeZone], 'PatchAction', PATCH_ACTION.CREATE);
  },

  stageDeleteZoneIntroTrigger(state, { ZoneID }) {
    Vue.set(state.zoneMap[ZoneID].Triggers[TRIGGER_TYPES.InitializeZone], 'PatchAction', PATCH_ACTION.DELETE);
  },

  introMessage(state, { ZoneID, message }) {
    Vue.set(state.zoneMap[ZoneID].Triggers[TRIGGER_TYPES.InitializeZone].AlwaysExec.PlaySounds[0], 'Val', message);
  },

  stageUpdateIntroMessage(state, { ZoneID }) {
    Vue.set(state.zoneMap[ZoneID].Triggers[TRIGGER_TYPES.InitializeZone], 'PatchAction', PATCH_ACTION.UPDATE);
  },

  lastViewedZone(state, id) {
    Vue.set(state, 'lastViewedZone', id);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
