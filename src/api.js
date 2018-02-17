import store from './store';

export default {
  GetAuthGoogle({ token, givenName, familyName } = {}) {
    return talkativeFetch('GET', `auth/google?token=${token}&gn=${givenName}&fn=${familyName}`);
  },

  GetProjects() {
    return talkativeFetch('GET', 'projects')
    .then(result => result.json());
  },

  GetProject({ ID } = {}) {
    return talkativeFetch('GET', `project/${ID}`)
    .then(result => result.json());
  },

  GetProjectMetadata({ ID } = {}) {
    return talkativeFetch('GET', `project/${ID}/metadata`)
    .then(result => result.json());
  },

  GetActor({ ID } = {}) {
    return talkativeFetch('GET', `actor/${ID}`)
    .then(result => result.json());
  },

  GetZone({ ID } = {}) {
    return talkativeFetch('GET', `zone/${ID}`)
    .then(result => result.json());
  },

  PutActor({ Actor } = {}) {
    for (const d of Actor.Dialogs || []) {
      if (!d.ID) continue;
    }
    return talkativeFetch('PATCH', `actor/${Actor.ID}`, Actor)
    .then(result => result.json());
  },

  PutZone({ zone } = {}) {
    return talkativeFetch('PUT', `zone/${zone.ID}`, zone)
    .then(result => result.json());
  },

  CreateZone({ CreateID, Title } = {}) {
    return talkativeFetch('PATCH', `project/${store.state.project.selectedProject.ID}`, {
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

  CreateActor({ Actor, ZoneActors = [] } = {}) {
    return talkativeFetch('PATCH', `project/${store.state.project.selectedProject.ID}`, {
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

  PatchProject({ project } = {}) {
    return talkativeFetch('PATCH', `project/${store.state.project.selectedProject.ID}`, project)
    .then(idMap => {
      if (idMap.status < 200 || idMap.status > 299) {
        return idMap.json().then(result => {
          throw result;
        });
      }
      return idMap.json();
    });
  },

  UpdateActorZones({ ActorZones } = {}) {
    return talkativeFetch('PATCH', `project/${store.state.project.selectedProject.ID}`, {
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

  CreateProject({ project } = {}) {
    return talkativeFetch('POST', `project`, project)
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
    return talkativeFetch('POST', `publish/${store.state.project.selectedProject.ID}`);
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

function talkativeFetch(method, path, payload) {
  const config = {
    method,
    headers: generateHeaders(),
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(payload)
  };

  let req = new Request(`${process.env.API_URL}${path}`, config);
  return new Promise((resolve, reject) => {
    return fetch(req).then(result => {
      if (result.status === 401) {
        store.dispatch('master/unauthorized', {}, { root: true });
        throw new Error('Unauthorized');
      }
      if (result.status === 404) {
        store.dispatch('master/NotFound', {}, { root: true });
      }
      if (result.status !== 200 && result.status !== 201) {
        throw result;
      }
      return result;
    }).then(result => {
      store.dispatch('master/token', result.headers.get('x-token'), { root: true });
      resolve(result);
    }).catch(err => {
      reject(err);
    });
  });
}
