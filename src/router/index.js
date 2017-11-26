import Vue from 'vue';
import Router from 'vue-router';
import ZoneHome from '@/components/routes/ZoneHome';
import ZoneCreate from '@/components/routes/ZoneCreate';
import ActorHome from '@/components/routes/ActorHome';
import ActorCreate from '@/components/routes/ActorCreate';
import ActorDialog from '@/components/routes/ActorDialog';
import DialogDeletion from '@/components/routes/DialogDeletion';
import NotFound from '@/components/routes/NotFound';
import ProjectCreate from '@/components/routes/ProjectCreate';
import ProjectSelect from '@/components/routes/ProjectSelect';
import ProjectHome from '@/components/routes/ProjectHome';
import SignIn from '@/components/routes/SignIn';
import store, { initializer } from '../store';
import { PUBLISH_STATUS } from '@/const';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/project/select',
      name: 'ProjectSelect',
      component: ProjectSelect,
      meta: {
        background: 'paper',
        theme: 'light',
        title: 'Your projects',
        outsideProject: true
      }
    },
    {
      path: '/sign-in',
      name: 'SignIn',
      component: SignIn,
      meta: {
        background: 'paper',
        theme: 'light',
        title: 'Sign in'
      }
    },
    {
      path: '/project/create',
      name: 'ProjectCreate',
      component: ProjectCreate,
      meta: {
        background: 'clouds',
        theme: 'light',
        title: 'Create a new project',
        outsideProject: true
      }
    },
    {
      path: '/actor/create',
      name: 'ActorCreate',
      props: true,
      component: ActorCreate,
      meta: {
        background: 'paper',
        theme: 'light',
        title: () => store.getters['project/selectedProjectTitle'],
        titleLink: () => router.push({ name: 'ProjectHome' })
      }
    },
    {
      path: '/actor/:id',
      name: 'ActorHome',
      component: ActorHome,
      meta: {
        background: 'paper',
        theme: 'light',
        title: () => store.getters['project/selectedProjectTitle'],
        titleLink: () => router.push({ name: 'ProjectHome' })
      },
      beforeEnter(to, from, next) {
        if (isNaN(to.params.id)) {
          next({ name: 'NotFound' });
        }
        store.dispatch('actors/selectActor', to.params.id)
        .then(() => next());
      }
    },
    {
      path: '/actor/:id/conversations',
      name: 'ActorDialog',
      component: ActorDialog,
      meta: {
        background: 'paper',
        theme: 'light',
        title: () => store.getters['project/selectedProjectTitle'],
        titleLink: () => router.push({ name: 'ProjectHome' })
      },
      async beforeEnter(to, from, next) {
        await store.dispatch('actors/selectActor', to.params.id);
        await store.dispatch('dialogs/cancelDeletion');
        await store.dispatch('dialogs/cancelEditDialog');
        await store.dispatch('dialogs/cancelConnectDialog');
        await store.dispatch('dialogs/selectDialog');
        next();
      }
    },
    {
      path: '/actor/:id/conversations/delete',
      name: 'DialogDeletion',
      component: DialogDeletion,
      meta: {
        background: 'paper',
        theme: 'light',
        title: () => store.getters['project/selectedProjectTitle'],
        titleLink: () => router.push({ name: 'ProjectHome' })
      }
    },
    {
      path: '/zone/create',
      name: 'ZoneCreate',
      component: ZoneCreate,
      meta: {
        background: 'paper',
        theme: 'light',
        title: () => store.getters['project/selectedProjectTitle'],
        titleLink: () => router.push({ name: 'ProjectHome' })
      },
      beforeEnter(to, from, next) {
        store.commit('master/clearSelectedEntity');
        next();
      }
    },
    {
      path: '/zone/:id',
      name: 'ZoneHome',
      component: ZoneHome,
      meta: {
        background: 'paper',
        theme: 'light',
        title: () => store.getters['project/selectedProjectTitle'],
        titleLink: () => router.push({ name: 'ProjectHome' })
      },
      async beforeEnter(to, from, next) {
        await store.dispatch('zones/selectZone', to.params.id);
        next();
      }
    },
    {
      path: '/',
      name: 'ProjectHome',
      component: ProjectHome,
      meta: {
        background: 'paper',
        theme: 'light',
        title: () => store.getters['project/selectedProjectTitle']
      },
      async beforeEnter(to, from, next) {
        let promises = [];
        promises.push(store.dispatch('project/refreshProject'));
        promises.push(store.dispatch('project/getMetadata'));
        await Promise.all(promises);
        if (store.state.project.metadata.Status === PUBLISH_STATUS.Publishing) {
          store.dispatch('project/beginCheckStatus');
        }
        store.commit('master/clearSelectedEntity');
        next();
      }
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.name !== 'SignIn') {
    store.commit('master/path', to.name);
  }

  if (!store.state.master.user && to.name !== 'SignIn') {
    return next({ name: 'SignIn' });
  }

  if (!store.state.project.selectedProject &&
    store.state.master.user &&
    to.name !== 'ProjectSelect' &&
    to.name !== 'ProjectCreate') {
    return next({ name: 'ProjectSelect' });
  }

  return next();
});

initializer.then(() => {
  const initialPath = router.currentRoute.name;

  if (initialPath && (initialPath === 'ProjectHome' || initialPath === 'SignIn')) {
    return router.replace({ name: store.state.master.path });
  }

  if (initialPath) {
    store.commit('master/path', initialPath);
  }
});

export default router;
