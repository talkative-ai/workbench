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
      commit('master/addZone', newZone);
      commit('selectEntity', { kind: 'zone', data: newZone, redirect: true });
      return newZone;
    });
  },

  createIntroMessage({ state, commit }, ZoneID) {
    commit('stageCreateZoneIntroTrigger', ZoneID);
  },

  saveIntroMessage({ state, commit }, { ZoneID, message }) {
    let zone = state.zoneMap[ZoneID];
    commit('introMessage', { zoneID: ZoneID, message });
    API.PatchProject({
      Zones: [{
        ID: zone.ID,
        Triggers: zone.Triggers
      }]
    });
  },

  removeIntroMessage({ state, commit }, ZoneID) {
    let zone = state.zoneMap[ZoneID];
    if (!zone.Triggers[TRIGGER_TYPES.InitializeZone] ||
      zone.Triggers[TRIGGER_TYPES.InitializeZone].PATCH_ACTION === PATCH_ACTION.CREATE) return;
    commit('stageDeleteZoneIntroTrigger', ZoneID);
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
        ZoneID: Number(ZoneID),
        ActorID: Number(ActorID),
        PatchAction: PATCH_ACTION.DELETE
      }]
    });
  },

  addActorToZone({ state, commit }, { ActorID, ZoneID }) {
    commit('addActor', { ZoneID, ActorID });
    commit('actors/addToZone', { ActorID, ZoneID }, { root: true });
    API.PatchProject({
      ZoneActors: [{
        ZoneID: Number(ZoneID),
        ActorID: Number(ActorID),
        PatchAction: PATCH_ACTION.CREATE
      }]
    });
  },

  selectZone({ commit, state, rootState }, zoneID) {
    if (rootState.master.selectedEntity.data && rootState.master.selectedEntity.data.ID === zoneID) return;
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
    state.zoneMap[zone.ID] = zone;
    state.zoneActors[zone.ID] = zone;
  },

  updateZone(state, zone) {
    state.zoneMap[zone.ID] = zone;
    if (!state.zoneActors[zone.ID]) {
      state.zoneActors[zone.ID] = {};
    }
  },

  zoneInMap(state, zone) {
    state.zoneMap[zone.ID] = zone;
  },

  zoneActors(state, { id, value }) {
    state.zoneActors[id] = value;
  },

  addActor(state, { ZoneID, ActorID }) {
    if (!state.zoneActors[ZoneID]) {
      state.zoneActors[ZoneID] = {};
    }
    state.zoneActors[ZoneID][ActorID] = true;
  },

  removeActor(state, { ZoneID, ActorID }) {
    if (!state.zoneActors[ZoneID]) {
      state.zoneActors[ZoneID] = {};
    }
    state.zoneActors[ZoneID][ActorID] = false;
  },

  stageCreateZoneIntroTrigger(state, ZoneID) {
    if (!state.zoneMap[ZoneID].Triggers[TRIGGER_TYPES.InitializeZone]) {
      state.zoneMap[ZoneID].Triggers[TRIGGER_TYPES.InitializeZone] = {
        'AlwaysExec': dcopy(defaultActionSet)
      };
    }
    state.zoneMap[ZoneID].Triggers[TRIGGER_TYPES.InitializeZone]['PatchAction'] = PATCH_ACTION.CREATE;
  },

  stageDeleteZoneIntroTrigger(state, { ZoneID }) {
    state.zoneMap[ZoneID].Triggers[TRIGGER_TYPES.InitializeZone]['PatchAction'] = PATCH_ACTION.DELETE;
  },

  introMessage(state, { ZoneID, message }) {
    state.zoneMap[ZoneID].Triggers[TRIGGER_TYPES.InitializeZone].AlwaysExec.PlaySounds[0]['Val'] = message;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
