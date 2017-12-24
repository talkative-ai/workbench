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

  GetProjectMetadata({ ID }) {
    return aumFetch('GET', `project/${ID}/metadata`)
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
    }
    return aumFetch('PATCH', `actor/${actor.ID}`, actor)
    .then(result => result.json());
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
  store.dispatch('master/isLoading', true);
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
    store.dispatch('master/isLoading', false);
    return result;
  });
}
