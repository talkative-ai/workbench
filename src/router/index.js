import Vue from 'vue'
import Router from 'vue-router'
import ZoneHome from '@/components/routes/ZoneHome'
import ZoneCreate from '@/components/routes/ZoneCreate'
import ActorHome from '@/components/routes/ActorHome'
import ActorCreate from '@/components/routes/ActorCreate'
import DialogEditor from '@/components/routes/DialogEditor'
import ProjectCreate from '@/components/routes/ProjectCreate'
import ProjectSelect from '@/components/routes/ProjectSelect'
import ProjectHome from '@/components/routes/ProjectHome'
import SignIn from '@/components/routes/SignIn'
import store, { initializer } from '../store'
import API from '../api'

Vue.use(Router)

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
        title: 'Your games'
      },
      beforeEnter (to, from, next) {
        API.GetProjects().then(result => {
          return result.json()
        }).then(result => {
          store.commit('set', { key: 'projectsList', value: result })
          if (!result.length) {
            return next({ name: 'ProjectCreate' })
          }
          return next()
        })
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
        title: 'Create a new game'
      }
    },
    {
      path: '/actor/create',
      name: 'ActorCreate',
      component: ActorCreate,
      meta: {
        background: 'paper',
        theme: 'light'
      }
    },
    {
      path: '/actor/:id',
      name: 'ActorHome',
      component: ActorHome
    },
    {
      path: '/actor/:id/dialog',
      name: 'DialogEditor',
      component: DialogEditor
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
      beforeEnter (to, from, next) {
        store.commit('clearSelectedEntity')
        next()
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
      beforeEnter (to, from, next) {
        store.commit('clearSelectedEntity')
        next()
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'SignIn') {
    store.commit('set', { key: 'path', value: to.name })
  }

  if (!store.state.user && to.name !== 'SignIn') {
    return next({ name: 'SignIn' })
  }

  if (!store.state.selectedProject &&
    store.state.user &&
    to.name !== 'ProjectSelect' &&
    to.name !== 'ProjectCreate') {
    return next({ name: 'ProjectSelect' })
  }

  return next()
})

initializer.then(() => {
  const initialPath = router.currentRoute.name

  if (initialPath && (initialPath === 'ProjectHome' || initialPath === 'SignIn')) {
    return router.replace({ name: store.state.path })
  }

  if (initialPath) {
    store.commit('set', { key: 'path', value: initialPath })
  }
})

export default router
