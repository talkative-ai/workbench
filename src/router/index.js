import Vue from 'vue';
import Router from 'vue-router';
import ZoneHome from '@/components/routes/ZoneHome';
import ZoneCreate from '@/components/routes/ZoneCreate';
import ActorHome from '@/components/routes/ActorHome';
import DialogHome from '@/components/routes/DialogHome';
import ActorCreate from '@/components/routes/ActorCreate';
import ActorSelect from '@/components/routes/ActorSelect';
import ActorDialog from '@/components/routes/ActorDialog';
import NotFound from '@/components/routes/NotFound';
import ProjectCreate from '@/components/routes/ProjectCreate';
import ProjectSelect from '@/components/routes/ProjectSelect';
import ProjectHome from '@/components/routes/ProjectHome';
import SignIn from '@/components/routes/SignIn';
import store, { initializer } from '../store';
import API from '../api';

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
        title: 'Your projects'
      },
      beforeEnter(to, from, next) {
        API.GetProjects().then(result => {
          return result.json();
        }).then(result => {
          Vue.set(store.state, 'projectsList', result);
          if (!result.length) {
            return next({ name: 'ProjectCreate' });
          }
          return next();
        });
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
        title: 'Create a new project'
      },
      beforeEnter(to, from, next) {
        store.dispatch('reset').then(() => {
          return next();
        });
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
        title: () => store.state.selectedProject.Title,
        titleLink: () => router.push({ name: 'ProjectHome' })
      }
    },
    {
      path: 'zone/:id/actor/select',
      name: 'ActorSelect',
      props: true,
      component: ActorSelect,
      meta: {
        background: 'paper',
        theme: 'light',
        title: () => store.state.selectedProject.Title,
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
        title: () => store.state.selectedProject.Title,
        titleLink: () => router.push({ name: 'ProjectHome' })
      },
      beforeEnter(to, from, next) {
        if (isNaN(to.params.id)) {
          next({ name: 'NotFound' });
        }
        store.dispatch('selectActor', to.params.id)
        .then(() => next());
      }
    },
    {
      path: '/actor/:id/dialog',
      name: 'ActorDialog',
      component: ActorDialog,
      meta: {
        background: 'paper',
        theme: 'light',
        title: () => store.state.selectedProject.Title,
        titleLink: () => router.push({ name: 'ProjectHome' })
      },
      beforeEnter(to, from, next) {
        store.dispatch('selectActor', to.params.id)
        .then(() => next());
      }
    },
    {
      path: '/zone/create',
      name: 'ZoneCreate',
      component: ZoneCreate,
      meta: {
        background: 'space',
        theme: 'dark',
        title: () => store.state.selectedProject.Title,
        titleLink: () => router.push({ name: 'ProjectHome' })
      },
      beforeEnter(to, from, next) {
        store.commit('clearSelectedEntity');
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
        title: () => store.state.selectedProject.Title,
        titleLink: () => router.push({ name: 'ProjectHome' })
      },
      beforeEnter(to, from, next) {
        store.dispatch('selectZone', to.params.id)
        .then(() => next());
      }
    },
    {
      path: '/',
      name: 'ProjectHome',
      component: ProjectHome,
      meta: {
        background: 'paper',
        theme: 'light',
        title: () => store.state.selectedProject.Title
      },
      beforeEnter(to, from, next) {
        store.commit('clearSelectedEntity');
        next();
      }
    },
    {
      path: '/actor/:id/dialog/:dialog_id/create',
      name: 'DialogCreate',
      component: DialogHome,
      meta: {
        background: 'paper',
        theme: 'light',
        title: () => store.state.selectedProject.Title,
        titleLink: () => router.push({ name: 'ProjectHome' })
      },
      beforeEnter(to, from, next) {
        store.commit('newDialog', { ParentID: Number(to.params.dialog_id) });
        to.params.isNew = true;
        store.dispatch('selectActor', to.params.id)
        .then(() => next());
      }
    },
    {
      path: '/actor/:id/dialog/:dialog_id',
      name: 'DialogHome',
      component: DialogHome,
      meta: {
        background: 'paper',
        theme: 'light',
        title: () => store.state.selectedProject.Title,
        titleLink: () => router.push({ name: 'ProjectHome' })
      },
      beforeEnter(to, from, next) {
        store.dispatch('selectActor', to.params.id)
        .then(() => next());
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
    Vue.set(store.state, 'path', to.name);
  }

  if (!store.state.user && to.name !== 'SignIn') {
    return next({ name: 'SignIn' });
  }

  if (!store.state.selectedProject &&
    store.state.user &&
    to.name !== 'ProjectSelect' &&
    to.name !== 'ProjectCreate') {
    return next({ name: 'ProjectSelect' });
  }

  return next();
});

initializer.then(() => {
  const initialPath = router.currentRoute.name;

  if (initialPath && (initialPath === 'ProjectHome' || initialPath === 'SignIn')) {
    return router.replace({ name: store.state.path });
  }

  if (initialPath) {
    Vue.set(store.state, 'path', initialPath);
  }
});

export default router;
