import Vue from 'vue'
import Router from 'vue-router'
import ZoneHome from '@/components/routes/ZoneHome'
import ZoneCreate from '@/components/routes/ZoneCreate'
import ActorHome from '@/components/routes/ActorHome'
import ActorCreate from '@/components/routes/ActorCreate'
import DialogEditor from '@/components/routes/DialogEditor'
import ProjectCreate from '@/components/routes/ProjectCreate'
import ProjectSelect from '@/components/routes/ProjectSelect'
import SignIn from '@/components/routes/SignIn'
import store, { initializer } from '../store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'ProjectSelect',
      component: ProjectSelect,
      meta: {
        background: 'paper',
        theme: 'light',
        title: 'Your games'
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
        theme: 'dark'
      }
    },
    {
      path: '/zone/:id',
      name: 'ZoneHome',
      component: ZoneHome,
      meta: {
        background: 'paper',
        theme: 'light'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/sign-in') {
    store.commit('set', { key: 'path', value: to.path })
  }
  return next()
})

initializer.then(() => {
  const initialPath = router.currentRoute.path

  if (!store.state.user) {
    return router.replace('/sign-in')
  }

  if (initialPath === '/' || initialPath === '/sign-in') {
    return router.replace(store.state.path)
  }

  store.commit('set', { key: 'path', value: initialPath })
})

export default router
