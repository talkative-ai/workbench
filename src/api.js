import store from './store';

export default {
  GetAuthGoogle({ token, givenName, familyName }) {
    return aumFetch('GET', `auth/google?token=${token}&gn=${givenName}&fn=${familyName}`);
  },

  GetProjects() {
    return aumFetch('GET', 'projects')
    .then(result => result.json());
  },

  GetProject({ ID }) {
    return aumFetch('GET', `project/${ID}`)
    .then(result => result.json());
  },

  GetActor({ ID }) {
    return aumFetch('GET', `actor/${ID}`)
    .then(result => result.json());
  },

  GetZone({ ID }) {
    return aumFetch('GET', `zone/${ID}`)
    .then(result => result.json());
  },

  PutActor(actor) {
    for (const d of actor.Dialogs || []) {
      if (!d.ID) continue;
      d.ID = Number(d.ID);
    }
    for (const r of actor.DialogRelations || []) {
      if (!isNaN(r.ChildNodeID)) {
        r.ChildNodeID = Number(r.ChildNodeID);
      }
      if (!isNaN(r.ParentNodeID)) {
        r.ParentNodeID = Number(r.ParentNodeID);
      }
    }
    return aumFetch('PUT', `actor/${actor.ID}`, actor)
    .then(result => {
      for (const d of actor.Dialogs || []) {
        if (!d.ID) continue;
        d.ID = d.ID.toString();
      }
      for (const r of actor.DialogRelations || []) {
        r.ChildNodeID = r.ChildNodeID.toString();
        r.ParentNodeID = r.ParentNodeID.toString();
      }

      return result.json();
    });
  },

  PutZone(zone) {
    return aumFetch('PUT', `zone/${zone.ID}`, zone)
    .then(result => result.json());
  },

  CreateZone({ CreateID, Title }) {
    return aumFetch('PATCH', `project/${store.state.project.selectedProject.ID}`, {
      Zones: [{
        CreateID,
        Title
      }]
    })
    .then(idMap => {
      if (idMap.status !== 201) {
        return idMap.json().then(result => {
          throw result;
        });
      }
      return idMap.json();
    });
  },

  CreateActor({ Actor, ZoneActors = [] }) {
    return aumFetch('PATCH', `project/${store.state.project.selectedProject.ID}`, {
      Actors: [ Actor ],
      ZoneActors
    })
    .then(idMap => {
      if (idMap.status !== 201) {
        return idMap.json().then(result => {
          throw result;
        });
      }
      return idMap.json();
    });
  },

  PatchProject(params) {
    return aumFetch('PATCH', `project/${store.state.project.selectedProject.ID}`, params)
    .then(idMap => {
      if (idMap.status < 200 || idMap.status > 299) {
        return idMap.json().then(result => {
          throw result;
        });
      }
      return idMap.json();
    });
  },

  UpdateActorZones(ActorZones) {
    return aumFetch('PATCH', `project/${store.state.project.selectedProject.ID}`, {
      ActorZones
    })
    .then(idMap => {
      if (idMap.status !== 201) {
        return idMap.json().then(result => {
          throw result;
        });
      }
      return idMap.json();
    });
  },

  CreateProject(project) {
    return aumFetch('POST', `project`, project)
    .then(result => {
      if (result.status !== 201) {
        return result.json().then(result => {
          throw result;
        });
      }
      return result.json();
    });
  },

  Publish() {
    return aumFetch('POST', `publish/${store.state.project.selectedProject.ID}`);
  }
};

function generateHeaders() {
  var myHeaders = new Headers();
  myHeaders.append('content-type', 'application/json');
  if (store.state.master.token) {
    myHeaders.append('x-token', store.state.master.token);
  }
  return myHeaders;
}

function aumFetch(method, path, payload) {
  const config = {
    method,
    headers: generateHeaders(),
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(payload)
  };

  let req = new Request(`${process.env.API_URL}${path}`, config);
  return fetch(req).then(result => {
    if (result.status === 401) {
      store.dispatch('master/unauthorized');
      throw new Error('Unauthorized');
    }
    if (result.status === 404) {
      store.dispatch('master/NotFound');
    }
    return result;
  }).then(result => {
    store.commit('master/token', result.headers.get('x-token'));
    return result;
  });
}
