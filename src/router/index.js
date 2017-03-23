import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Monitor from '@/components/Monitor'
import NewBrew from '@/components/Brew'
import {token} from '@/api'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'hello',
      component: Hello
    },
    {
      path: '/brew',
      name: 'brew',
      meta: {description: 'Brew'},
      component: NewBrew
    },
    {
      path: '/monitor',
      name: 'monitor',
      meta: {description: 'Brew Sensors'},
      component: Monitor
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (!token() && to.path !== '/') {
    return next('/')
  } else {
    return next()
  }
})

export default router
